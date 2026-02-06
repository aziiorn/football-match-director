const teamModel = require('../models/teamModel');
const { getClient } = require('../loaders/redis');

const CACHE_KEY_TEAMS = 'teams';
const TEAM_CACHE_TTL = 300;

const getAllTeams = async () => {
    try {
        const redis = getClient();
        const cached = await redis.get(CACHE_KEY_TEAMS);
        if (cached) return JSON.parse(cached);

        const teams = await teamModel.getAllTeams();
        await redis.set(CACHE_KEY_TEAMS, JSON.stringify(teams), 'EX', TEAM_CACHE_TTL);
        return teams;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getTeamById = async (id) => {
    try {
        const redis = getClient();
        const cacheKey = `team:${id}`;
        const cached = await redis.get(cacheKey);
        if (cached) return JSON.parse(cached);

        const team = await teamModel.getTeamByPk(id);
        if (!team) return null;

        await redis.set(cacheKey, JSON.stringify(team), 'EX', TEAM_CACHE_TTL);
        return team;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getTeamByName = async (name) => {
    try {
        const redis = getClient();
        const cacheKey = `team:name:${name}`;
        const cached = await redis.get(cacheKey);
        if (cached) return JSON.parse(cached);

        const team = await teamModel.getTeamByName(name);
        if (!team) return null;

        await redis.set(cacheKey, JSON.stringify(team), 'EX', TEAM_CACHE_TTL);
        return team;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getAllTeams,
    getTeamById,
    getTeamByName
};