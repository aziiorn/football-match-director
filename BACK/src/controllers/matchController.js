const matchService = require('../services/matchService');

const getAllMatches = async (_req, res) => {
    try {
        const matches = await matchService.getAllMatches();
        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMatchById = async (req, res) => {
    const { id } = req.params;
    try {
        const match = await matchService.getMatchById(id);
        res.json(match);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createMatch = async (req, res) => {
    const { opponent, date, homeTeamScore, awayTeamScore } = req.body;
    try {
        const match = await matchService.createMatch(opponent, date, homeTeamScore, awayTeamScore);
        res.status(201).json(match);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateMatch = async (req, res) => {
    const { id } = req.params;
    const { date, homeTeamScore, awayTeamScore, status } = req.body;
    try {
        const match = await matchService.updateMatch(id, date, homeTeamScore, awayTeamScore, status);
        res.json(match);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteMatch = async (req, res) => {
    const { id } = req.params;
    try {
        await matchService.deleteMatch(id);
        res.json(match);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const teamMatches = async (req, res) => {
    const { team } = req.params;
    try {
        matches = await matchService.getMatchesByTeam(team);
        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const upcoming = async (_req, res) => {
    try {
        const result = await matchService.getUpcomingMatches();
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const results = async (_req, res) => {
    try {
        const result = await matchService.getResults();
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const score = async (req, res) => {
    const { score } = req.params;
    if (!score || !score.includes('-')) {
        return res.status(400).json({ error: 'Invalid score' });
    }

    const [leftScore, rightScore] = score.split('-').map(Number);
    if (isNaN(leftScore) || isNaN(rightScore)) {
        return res.status(400).json({ error: 'Invalid score numbers' });
    }

    try {
        const result = await matchService.getMatchesByScore(leftScore, rightScore);
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const goal = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'Invalid match ID' });
    }

    const { team, playerId } = req.body;
    if (!team || !playerId) {
        return res.status(400).json({ error: 'Invalid team or playerId' });
    }

    try {
        await matchService.addGoal(id, team.id, playerId);
        res.status(200).json({ message: 'Goal added successfully' });

    } catch (e) {
        const msg = e.message?.toLowerCase() || '';

        if (msg.includes('not found') || msg.includes('introuvable')) {
            return res.status(404).json({ error: e.message });
        }

        if (msg.includes('match terminé') || msg.includes('match fini')) {
            return res.status(403).json({ error: e.message });
        }

        return res.status(500).json({ error: 'Internal server error', detail: e.message });
    }
};

module.exports = {
    getAllMatches,
    getMatchById,
    createMatch,
    updateMatch,
    deleteMatch,
    upcoming,
    results,
    score,
    goal,
    teamMatches
};