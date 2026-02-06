const Bet = require('../models/betModel');
const User = require('../services/userService');
const matchModel = require('../models/matchModel');
const oddsModel = require('../models/oddModel');

async function createBet(userId, matchId, betType, amount) {
    const match = await matchModel.getMatchByPk(matchId);
    if (!match || match.status === 'finished') {
        throw new Error('Match introuvable ou déjà terminé');
    }

    if (amount < 0.10 || amount > 10000) {
        throw new Error('Montant de pari invalide');
    }

    const existingBet = await Bet.findOne({
        where: {
            user_id: userId,
            match_id: matchId,
            status: 'pending'
        }
    });

    if (existingBet) {
        throw new Error('Vous avez déjà placé un pari sur ce match.');
    }

    const odds = await oddsModel.getOddsByMatchId(matchId);
    if (!odds) throw new Error('Cotes non trouvées');

    let selectedOdds = null;
    if (betType === 'home_win') selectedOdds = odds.home_win;
    else if (betType === 'draw') selectedOdds = odds.draw;
    else if (betType === 'away_win') selectedOdds = odds.away_win;
    else throw new Error('Type de pari invalide');

    return Bet.create({
        user_id: userId,
        match_id: matchId,
        bet_type: betType,
        amount,
        odds_at_bet_time: selectedOdds
    });
}

async function resolveBets(matchId) {
    const match = await matchModel.getMatchByPk(matchId);
    if (!match || match.homeTeamScore === null || match.awayTeamScore === null) return;

    let result;
    if (match.homeTeamScore > match.awayTeamScore) result = 'home_win';
    else if (match.homeTeamScore < match.awayTeamScore) result = 'away_win';
    else result = 'draw';

    const bets = await Bet.findAll({ where: { match_id: matchId, status: 'pending' } });

    for (const bet of bets) {
        const user = await User.getUserById(bet.user_id);
        if (!user) continue;

        const won = bet.bet_type === result;
        const payout = won ? bet.amount * bet.odds_at_bet_time : 0;

        if (won) {
            await User.updateUserBalance(bet.user_id, payout)
        } else {
            await User.updateUserBalance(bet.user_id, -bet.amount)
        }

        await user.save();

        bet.status = won ? 'won' : 'lost';
        await bet.save();
    }
}

async function getBetsByUser(userId) {
    return Bet.findAll({
        where: { user_id: userId },
        order: [['date', 'DESC']]
    });
}

module.exports = {
    createBet,
    resolveBets,
    getBetsByUser
};