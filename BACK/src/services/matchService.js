const matchModel = require('../models/matchModel');
const { getClient } = require('../loaders/redis');
const Player = require('../models/playerModel');
const { resolveBets } = require('./betService');

const CACHE_TTL = 300;

const getAllMatches = async (options = {}) => {
    const useCache = Object.keys(options).length === 0;
    const cacheKey = 'matches';
    const redis = getClient();

    if (useCache) {
        const cached = await redis.get(cacheKey);
        if (cached) return JSON.parse(cached);
    }

    const matches = await matchModel.getAllMatches(options);

    if (useCache) {
        await redis.set(cacheKey, JSON.stringify(matches), 'EX', CACHE_TTL);
    }

    return matches;
};

const getMatchById = async (id) => {
    const redis = getClient();
    const cacheKey = `match:${id}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const match = await matchModel.getMatchByPk(id);
    if (match) await redis.set(cacheKey, JSON.stringify(match), 'EX', CACHE_TTL);
    return match;
};

const getUpcomingMatches = async () => {
    const redis = getClient();
    const cacheKey = 'matches:upcoming';
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const matches = await getAllMatches();
    const upcoming = matches.filter(m => m.homeTeamScore === null && m.awayTeamScore === null);

    await redis.set(cacheKey, JSON.stringify(upcoming), 'EX', CACHE_TTL);
    return upcoming;
};

const getMatchesByTeam = async (teamId) => {
    const redis = getClient();
    const cacheKey = 'matches:team:' + teamId;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const matches = await getAllMatches();
    const team = Number(teamId);
    const m = matches.filter(m => m.home_team_id === team || m.away_team_id === team);

    await redis.set(cacheKey, JSON.stringify(m), 'EX', CACHE_TTL);
    return m;
};

const getResults = async () => {
    const redis = getClient();
    const cacheKey = 'matches:results';
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const matches = await getAllMatches();
    const results = matches
        .filter(m => m.homeTeamScore !== null && m.awayTeamScore !== null)
        .map(m => {
            const outcome =
                m.homeTeamScore > m.awayTeamScore ? "Victory" :
                    m.homeTeamScore < m.awayTeamScore ? "Defeat" : "Draw";
            return {
                opponent: m.opponent,
                date: m.date,
                homeTeamScore: m.homeTeamScore,
                awayTeamScore: m.awayTeamScore,
                result: outcome
            };
        });

    await redis.set(cacheKey, JSON.stringify(results), 'EX', CACHE_TTL);
    return results;
};

const getMatchesByScore = async (left, right) => {
    const redis = getClient();
    const cacheKey = `matches:score:${left}-${right}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const matches = await getAllMatches({ where: { homeTeamScore: left, awayTeamScore: right } });
    await redis.set(cacheKey, JSON.stringify(matches), 'EX', CACHE_TTL);
    return matches;
};

const createMatch = async (opponent, date, homeTeamScore, awayTeamScore) => {
    const match = await matchModel.createMatch({ opponent, date, homeTeamScore, awayTeamScore });

    await invalidateMatchCache(match.id);
    return match;
};

const updateMatch = async (id, date, homeTeamScore, awayTeamScore, status) => {
    const match = await matchModel.getMatchByPk(id);
    if (!match) throw new Error("Match introuvable");

    const updatedMatch = await matchModel.updateMatch(match, date, homeTeamScore, awayTeamScore, status);

    await invalidateMatchCache(id);

    if (updatedMatch.status === 'finished') {
        await resolveBets(id);
    }

    return updatedMatch;
};

const deleteMatch = async (id) => {
    const match = await matchModel.getMatchByPk(id);
    await matchModel.deleteMatch(match);

    await invalidateMatchCache(id);
};

const invalidateMatchCache = async (id) => {
    const redisClient = getClient();
    const match = await matchModel.getMatchByPk(id);
    if (!match) return;

    const keysToDelete = [
        `matches`,
        `match:${id}`,
        `matches:upcoming`,
        `matches:results`,
        `matches:team:${match.home_team_id}`,
        `matches:team:${match.away_team_id}`
    ];

    const scoreKeys = await redisClient.keys('matches:score:*');
    if (scoreKeys.length > 0) keysToDelete.push(...scoreKeys);

    await redisClient.del(...keysToDelete);
};

const invalidatePlayerCache = async (playerId) => {
    const redis = getClient();
    const key = `player:${playerId}`;
    await redis.del(key);
};

const addGoal = async (id, team, playerId) => {
    const match = await matchModel.getMatchByPk(id);
    if (!match) throw new Error('Match not found');
    if (match.status === 'finished') throw new Error('Match terminé');

    await matchModel.addGoal(match, team);

    const updatedMatch = await matchModel.getMatchByPk(id);
    console.log(updatedMatch);

    await matchModel.updateMatch(
        updatedMatch,
        null,
        updatedMatch.homeTeamScore,
        updatedMatch.awayTeamScore,
        null
    );

    const player = await Player.getPlayerByPk(playerId);
    if (!player) throw new Error('Joueur non trouvé');

    player.goalsScored += 1;
    await player.save();

    await invalidateMatchCache(id);
    await invalidatePlayerCache(playerId);

    const redis = getClient();
    await redis.publish('match:goal', JSON.stringify({ matchId: id, team, playerId }));
};

module.exports = {
    getAllMatches,
    getMatchById,
    createMatch,
    updateMatch,
    deleteMatch,
    getUpcomingMatches,
    getResults,
    getMatchesByScore,
    addGoal,
    getMatchesByTeam,
    invalidateMatchCache
};