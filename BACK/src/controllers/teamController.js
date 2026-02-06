const teamService = require('../services/teamService');

const getAllTeams = async (_req, res) => {
    try {
        const teams = await teamService.getAllTeams();
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTeamById = async (req, res) => {
    const { id } = req.params;
    try {
        const team = await teamService.getTeamById(id);
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }
        res.json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTeamByName = async (req, res) => {
    const { name } = req.params;
    try {
        const team = await teamService.getTeamByName(name);
        if (!team || team.length === 0) {
            return res.status(404).json({ error: 'Team not found' });
        }
        res.json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllTeams,
    getTeamById,
    getTeamByName,
};