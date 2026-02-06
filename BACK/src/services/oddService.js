const oddModel = require('../models/oddModel');
const { getClient } = require('../loaders/redis');

const CACHE_TTL = 300;

const getAllOdds = async () => {
    const redis = getClient();
    const cacheKey = 'odds:all';
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const odds = await oddModel.getAllOdds();
    await redis.set(cacheKey, JSON.stringify(odds), 'EX', CACHE_TTL);
    return odds;
};

const getOddsByMatchId = async (matchId) => {
    const redis = getClient();
    const cacheKey = `odds:match:${matchId}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const odds = await oddModel.getOddsByMatchId(matchId);
    if (odds) {
        await redis.set(cacheKey, JSON.stringify(odds), 'EX', CACHE_TTL);
    }
    return odds;
};

const createOdds = async (matchId, homeWin, draw, awayWin) => {
    const odds = await oddModel.createOdds({
        match_id: matchId,
        home_win: homeWin,
        draw,
        away_win: awayWin
    });

    await invalidateOddsCache(matchId);
    return odds;
};

const updateOdds = async (matchId, homeWin, draw, awayWin) => {
    const odds = await oddModel.getOddsByMatchId(matchId);
    if (!odds) throw new Error('Odds not found');

    const updated = await oddModel.updateOdds(odds, homeWin, draw, awayWin);
    await invalidateOddsCache(matchId);
    return updated;
};

const deleteOdds = async (matchId) => {
    const odds = await oddModel.getOddsByMatchId(matchId);
    if (!odds) throw new Error('Odds not found');

    await oddModel.deleteOdds(odds);
    await invalidateOddsCache(matchId);
};

const invalidateOddsCache = async (matchId) => {
    const redis = getClient();
    const keys = [`odds:all`, `odds:match:${matchId}`];
    await redis.del(...keys);
};

module.exports = {
    getAllOdds,
    getOddsByMatchId,
    createOdds,
    updateOdds,
    deleteOdds
};