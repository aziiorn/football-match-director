const betService = require('../../src/services/betService');
const Bet = require('../../src/models/betModel');
const User = require('../../src/models/userModel');
const matchModel = require('../../src/models/matchModel');
const oddsModel = require('../../src/models/oddModel');

jest.mock('../../src/models/betModel');
jest.mock('../../src/models/userModel');
jest.mock('../../src/models/matchModel');
jest.mock('../../src/models/oddModel');

describe('createBet', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('doit créer un pari valide', async () => {
        const fakeMatch = { id: 1, status: 'ongoing' };
        const fakeOdds = { home_win: 1.8, draw: 3.0, away_win: 2.2 };

        matchModel.getMatchByPk.mockResolvedValue(fakeMatch);
        Bet.findOne.mockResolvedValue(null);
        oddsModel.getOddsByMatchId.mockResolvedValue(fakeOdds);
        Bet.create.mockResolvedValue({ id: 1 });

        const result = await betService.createBet(1, 1, 'home_win', 100);

        expect(result).toEqual({ id: 1 });
        expect(Bet.create).toHaveBeenCalledWith({
            user_id: 1,
            match_id: 1,
            bet_type: 'home_win',
            amount: 100,
            odds_at_bet_time: 1.8
        });
    });

    it('doit refuser un pari si un pari en attente existe déjà', async () => {
        matchModel.getMatchByPk.mockResolvedValue({ id: 1, status: 'ongoing' });
        Bet.findOne.mockResolvedValue({ id: 42 });

        await expect(betService.createBet(1, 1, 'draw', 50))
            .rejects.toThrow('Vous avez déjà placé un pari sur ce match.');
    });

    it('doit refuser un pari sur un match terminé', async () => {
        matchModel.getMatchByPk.mockResolvedValue({ id: 1, status: 'finished' });

        await expect(betService.createBet(1, 1, 'away_win', 30))
            .rejects.toThrow('Match introuvable ou déjà terminé');
    });

    it('doit refuser un pari avec un type invalide', async () => {
        matchModel.getMatchByPk.mockResolvedValue({ id: 1, status: 'ongoing' });
        Bet.findOne.mockResolvedValue(null);
        oddsModel.getOddsByMatchId.mockResolvedValue({ home_win: 1.8, draw: 3.0, away_win: 2.2 });

        await expect(betService.createBet(1, 1, 'invalid_type', 20))
            .rejects.toThrow('Type de pari invalide');
    });
});

describe('resolveBets', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('doit résoudre les paris correctement et mettre à jour les soldes', async () => {
        const match = {
            id: 1,
            homeTeamScore: 2,
            awayTeamScore: 1
        };

        const fakeBets = [
            { id: 1, user_id: 10, bet_type: 'home_win', amount: 100, odds_at_bet_time: 1.8, save: jest.fn() },
            { id: 2, user_id: 11, bet_type: 'away_win', amount: 50, odds_at_bet_time: 2.2, save: jest.fn() }
        ];

        const users = {
            10: { id: 10, balance: 100, save: jest.fn() },
            11: { id: 11, balance: 150, save: jest.fn() }
        };

        matchModel.getMatchByPk.mockResolvedValue(match);
        Bet.findAll.mockResolvedValue(fakeBets);
        User.findByPk.mockImplementation((id) => Promise.resolve(users[id]));

        await betService.resolveBets(match.id);

        expect(users[10].balance).toBe(100 + 100 * 1.8);
        expect(fakeBets[0].status).toBe('won');
        expect(fakeBets[0].save).toHaveBeenCalled();
        expect(users[10].save).toHaveBeenCalled();

        expect(users[11].balance).toBe(150 - 50);
        expect(fakeBets[1].status).toBe('lost');
        expect(fakeBets[1].save).toHaveBeenCalled();
        expect(users[11].save).toHaveBeenCalled();
    });

    it('ne fait rien si le score est incomplet', async () => {
        matchModel.getMatchByPk.mockResolvedValue({
            id: 1,
            homeTeamScore: null,
            awayTeamScore: null
        });

        const result = await betService.resolveBets(1);
        expect(result).toBeUndefined();
        expect(Bet.findAll).not.toHaveBeenCalled();
    });
});

describe('getBetsByUser', () => {
    it('doit retourner les paris triés par date', async () => {
        const fakeBets = [{ id: 1 }, { id: 2 }];
        Bet.findAll.mockResolvedValue(fakeBets);

        const result = await betService.getBetsByUser(42);

        expect(Bet.findAll).toHaveBeenCalledWith({
            where: { user_id: 42 },
            order: [['date', 'DESC']]
        });
        expect(result).toBe(fakeBets);
    });
});