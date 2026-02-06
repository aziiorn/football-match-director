const betService = require('../services/betService');

async function createBet(req, res) {
  const { matchId, betType, amount } = req.body;
  const userId = req.user.id;

  try {
    const bet = await betService.createBet(userId, matchId, betType, amount);
    res.status(201).json(bet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getBetsByUser(req, res) {
  const userId = req.user.id;

  try {
    const bets = await betService.getBetsByUser(userId);
    res.json(bets);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des paris.' });
  }
}

module.exports = {
  createBet,
  getBetsByUser
};