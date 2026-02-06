const playerModel = require('../models/playerModel');
const { getClient } = require('../loaders/redis');

const CACHE_KEY_PLAYERS = 'players';
const CACHE_KEY_TOP_SCORERS = 'topScorers';
const INJURED_QUEUE_KEY = 'players:injured';
const CACHE_TTL = 300;

const getAllPlayers = async (options = {}) => {
    try {
        const redis = getClient();
        const cached = await redis.get(CACHE_KEY_PLAYERS);
        if (cached) {
            return JSON.parse(cached);
        }
        const players = await playerModel.getAllPlayers(options);
        await redis.set(CACHE_KEY_PLAYERS, JSON.stringify(players), 'EX', CACHE_TTL);
        return players;
    }
    catch (error) {
        throw new Error(error.message);
    }
}

const getPlayerById = async (id) => {
    try {
        const player = await playerModel.getPlayerByPk(id);
        if (!player) return null;

        const redis = getClient();
        const cacheKey = `player:${id}`;

        const cached = await redis.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }

        await redis.set(cacheKey, JSON.stringify(player), 'EX', CACHE_TTL);
        return player;
    } catch (error) {
        throw new Error(error.message);
    }
};

const createPlayer = async (name, position, number) => {
    try {
        const redis = getClient();
        await redis.del(
            CACHE_KEY_PLAYERS,
            CACHE_KEY_TOP_SCORERS,
            'players:stats'
        );
        const keys = await redis.keys('players:position:*');
        if (keys.length > 0) await redis.del(...keys);
        return await playerModel.createPlayer({ name: name, position: position, number: number, goalsScored: 0, assists: 0 });
    }
    catch (error) {
        throw new Error(error.message);
    }
}

const updatePlayer = async (id, name, position, number, goalsScored, assists) => {
    try {
        const player = await playerModel.getPlayerByPk(id);
        const updated = await playerModel.updatePlayer(player, name, position, number, goalsScored, assists);

        const redis = getClient();
        await redis.del(
            CACHE_KEY_PLAYERS,
            CACHE_KEY_TOP_SCORERS,
            `player:${id}`,
            'players:stats'
        );
        const keys = await redis.keys('players:position:*');
        if (keys.length > 0) await redis.del(...keys);

        return updated;
    } catch (error) {
        throw new Error(error.message);
    }
};

const deletePlayer = async (id) => {
    try {
        const player = await playerModel.getPlayerByPk(id);
        const deleted = await playerModel.deletePlayer(player);

        const redis = getClient();
        await redis.del(
            CACHE_KEY_PLAYERS,
            CACHE_KEY_TOP_SCORERS,
            `player:${id}`,
            'players:stats'
        );
        const keys = await redis.keys('players:position:*');
        if (keys.length > 0) await redis.del(...keys);

        return deleted;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getTopScorers = async () => {
    const redis = getClient();

    const cached = await redis.get(CACHE_KEY_TOP_SCORERS);
    if (cached) {
        return JSON.parse(cached);
    }

    const players = await getAllPlayers();
    const topScorers = players
        .sort((a, b) => b.goalsScored - a.goalsScored)
        .slice(0, 3);

    await redis.set(CACHE_KEY_TOP_SCORERS, JSON.stringify(topScorers), 'EX', CACHE_TTL);

    return topScorers;
};

const getPlayerByTeam = async (team_id) => {
    const redis = getClient();
    const cacheKey = `players:team:${team_id}`;

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const players = await playerModel.getAllPlayers({ where: { team_id } });
    await redis.set(cacheKey, JSON.stringify(players), 'EX', CACHE_TTL);
    return players;
};

const getPlayersByPosition = async (position) => {
    const redis = getClient();
    const cacheKey = `players:position:${position}`;

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const players = await playerModel.getAllPlayers({ where: { position } });
    await redis.set(cacheKey, JSON.stringify(players), 'EX', CACHE_TTL);
    return players;
};

const getPlayerStats = async () => {
    const redis = getClient();
    const cacheKey = 'players:stats';

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const players = await playerModel.getAllPlayers();
    const stats = players.reduce((acc, player) => {
        const existing = acc.find(p => p.name === player.name);

        if (existing) {
            existing.totalGoals += player.goalsScored;
            existing.totalAssists += player.assists;
            existing.totalContributions += player.goalsScored + player.assists;
        } else {
            acc.push({
                name: player.name,
                totalGoals: player.goalsScored,
                totalAssists: player.assists,
                totalContributions: player.goalsScored + player.assists
            });
        }

        return acc;
    }, []);

    await redis.set(cacheKey, JSON.stringify(stats), 'EX', CACHE_TTL);
    return stats;
};

const injured = async (id) => {
    const redis = getClient();
    const player = await playerModel.getPlayerByPk(id);
    if (!player) throw new Error('Player not found');

    const currentInjured = await redis.lrange(INJURED_QUEUE_KEY, 0, -1);
    if (currentInjured.includes(id.toString())) {
        console.log(`[Redis] Player ${id} is already marked as injured.`);
        return;
    }

    await redis.rpush(INJURED_QUEUE_KEY, id);
    await redis.publish('player:injured', JSON.stringify({ playerId: id }));
};

const recovered = async () => {
    const redis = getClient();

    const playerId = await redis.lpop(INJURED_QUEUE_KEY);
    if (!playerId) {
        console.log('[Redis] No injured players in queue.');
        return null;
    }

    const player = await playerModel.getPlayerByPk(playerId);
    if (!player) {
        console.warn(`[Redis] Player ${playerId} not found in DB.`);
        return null;
    }
    await redis.publish('player:recovered', JSON.stringify({ playerId }));
    return player;
};

module.exports = {
    getAllPlayers,
    getPlayerById,
    createPlayer,
    updatePlayer,
    deletePlayer,
    getTopScorers,
    getPlayerByTeam,
    getPlayersByPosition,
    getPlayerStats,
    injured,
    recovered,
};