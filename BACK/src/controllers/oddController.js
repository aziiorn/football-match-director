const oddService = require('../services/oddService');

const getAllOdds = async (_req, res) => {
    try {
        const odds = await oddService.getAllOdds();
        res.status(200).json(odds);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getOddsByMatchId = async (req, res) => {
    const { matchId } = req.params;
    try {
        const odds = await oddService.getOddsByMatchId(matchId);
        if (!odds) {
            return res.status(404).json({ error: 'Odds not found for this match' });
        }
        res.status(200).json(odds);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createOdds = async (req, res) => {
    const { matchId, home_win, draw, away_win } = req.body;
    if (!matchId || home_win === undefined || draw === undefined || away_win === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const odds = await oddService.createOdds(matchId, home_win, draw, away_win);
        res.status(201).json(odds);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateOdds = async (req, res) => {
    const { matchId } = req.params;
    const { home_win, draw, away_win } = req.body;

    try {
        const updated = await oddService.updateOdds(matchId, home_win, draw, away_win);
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteOdds = async (req, res) => {
    const { matchId } = req.params;

    try {
        await oddService.deleteOdds(matchId);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllOdds,
    getOddsByMatchId,
    createOdds,
    updateOdds,
    deleteOdds
};
