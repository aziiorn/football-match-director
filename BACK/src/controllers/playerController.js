const playerService = require('../services/playerService');

const getAllPlayers = async (_req, res) => {
    try {
        const players = await playerService.getAllPlayers();
        res.json(players);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPlayerById = async (req, res) => {
    const { id } = req.params;
    try {
        const player = await playerService.getPlayerById(id);
        res.json(player);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createPlayer = async (req, res) => {
    const { name, position, number } = req.body;
    try {
        const player = await playerService.createPlayer(name, position, number);
        res.status(201).json(player);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updatePlayer = async (req, res) => {
    const { id } = req.params;
    const { name, position, number, goalsScored, assists } = req.body;
    try {
        const player = await playerService.updatePlayer(id, name, position, number, goalsScored, assists);
        res.json(player);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deletePlayer = async (req, res) => {
    const { id } = req.params;
    try {
        const player = await playerService.deletePlayer(id);
        res.json(player);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const topScorers = async (_req, res) => {
    try {
        const top = await playerService.getTopScorers();
        res.status(200).json(top);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const team = async (req, res) => {
    try {
        const { team } = req.params;
        const players = await playerService.getPlayerByTeam(team);
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const position = async (req, res) => {
    try {
        const { position } = req.params;
        const players = await playerService.getPlayersByPosition(position);
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const stats = async (_req, res) => {
    try {
        const stats = await playerService.getPlayerStats();
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const injured = async (req, res) => {
    try {
        const { id } = req.params;
        await playerService.injured(id);
        res.status(200).json();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const recovered = async (_req, res) => {
    try {
        const player = await playerService.recovered();
        res.status(200).json(player);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllPlayers,
    getPlayerById,
    createPlayer,
    updatePlayer,
    deletePlayer,
    topScorers,
    team,
    position,
    stats,
    injured,
    recovered,
};