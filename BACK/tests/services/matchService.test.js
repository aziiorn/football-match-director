const matchService = require('../../src/services/matchService');
const matchModel = require('../../src/models/matchModel');
const Player = require('../../src/models/playerModel');
const redis = require('../../src/loaders/redis');
const { resolveBets } = require('../../src/services/betService');

jest.mock('../../src/models/matchModel');
jest.mock('../../src/models/playerModel');
const mockRedisClient = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
    publish: jest.fn(),
};

jest.mock('../../src/loaders/redis', () => ({
    getClient: jest.fn(() => mockRedisClient),
}));
jest.mock('../../src/services/betService');

describe('matchService', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockRedisClient.get.mockReset();
        mockRedisClient.set.mockReset();
        mockRedisClient.del.mockReset();
        mockRedisClient.keys.mockReset();
        mockRedisClient.publish.mockReset();

        mockRedisClient.keys.mockResolvedValue([]);
    });

    describe('getAllMatches', () => {
        it('renvoie les matchs depuis Redis si présent', async () => {
            const fakeData = [{ id: 1 }];
            redis.getClient().get.mockResolvedValue(JSON.stringify(fakeData));

            const result = await matchService.getAllMatches();
            expect(result).toEqual(fakeData);
        });

        it('renvoie les matchs depuis la DB si non en cache', async () => {
            redis.getClient().get.mockResolvedValue(null);
            matchModel.getAllMatches.mockResolvedValue([{ id: 1 }]);

            const result = await matchService.getAllMatches();
            expect(result).toEqual([{ id: 1 }]);
            expect(redis.getClient().set).toHaveBeenCalled();
        });
    });

    describe('getMatchById', () => {
        it('utilise le cache Redis si disponible', async () => {
            const match = { id: 2 };
            redis.getClient().get.mockResolvedValue(JSON.stringify(match));

            const result = await matchService.getMatchById(2);
            expect(result).toEqual(match);
        });

        it('récupère depuis DB et met en cache sinon', async () => {
            redis.getClient().get.mockResolvedValue(null);
            matchModel.getMatchByPk.mockResolvedValue({ id: 3 });

            const result = await matchService.getMatchById(3);
            expect(result).toEqual({ id: 3 });
            expect(redis.getClient().set).toHaveBeenCalled();
        });
    });

    describe('updateMatch', () => {
        it('met à jour un match et appelle resolveBets si terminé', async () => {
            const fakeMatch = { id: 1, status: 'ongoing' };
            matchModel.getMatchByPk.mockResolvedValue(fakeMatch);
            matchModel.updateMatch.mockResolvedValue({ id: 1, status: 'finished' });

            const result = await matchService.updateMatch(1, '2025-01-01', 2, 1, 'finished');

            expect(matchModel.updateMatch).toHaveBeenCalledWith(fakeMatch, '2025-01-01', 2, 1, 'finished');
            expect(resolveBets).toHaveBeenCalledWith(1);
            expect(result.status).toBe('finished');
        });

        it('lève une erreur si match introuvable', async () => {
            matchModel.getMatchByPk.mockResolvedValue(null);

            await expect(matchService.updateMatch(99)).rejects.toThrow('Match introuvable');
        });
    });

    describe('deleteMatch', () => {
        it('supprime un match et invalide le cache', async () => {
            const match = { id: 1 };
            matchModel.getMatchByPk.mockResolvedValue(match);

            await matchService.deleteMatch(1);

            expect(matchModel.deleteMatch).toHaveBeenCalledWith(match);
            expect(redis.getClient().del).toHaveBeenCalled();
        });
    });

    describe('addGoal', () => {
        it('ajoute un but et publie sur Redis', async () => {
            const match = { id: 1, status: 'ongoing', homeTeamScore: 1, awayTeamScore: 0 };
            const player = { goalsScored: 2, save: jest.fn() };

            matchModel.getMatchByPk.mockResolvedValueOnce(match);
            matchModel.addGoal.mockResolvedValue();
            matchModel.getMatchByPk.mockResolvedValueOnce(match);
            matchModel.updateMatch.mockResolvedValue();
            Player.getPlayerByPk.mockResolvedValue(player);

            await matchService.addGoal(1, 'home', 42);

            expect(matchModel.addGoal).toHaveBeenCalledWith(match, 'home');
            expect(player.goalsScored).toBe(3);
            expect(player.save).toHaveBeenCalled();
            expect(redis.getClient().publish).toHaveBeenCalled();
        });

        it('rejette si joueur ou match est introuvable', async () => {
            matchModel.getMatchByPk.mockResolvedValue(null);
            await expect(matchService.addGoal(1, 'home', 42)).rejects.toThrow('Match not found');

            matchModel.getMatchByPk.mockResolvedValue({ status: 'finished' });
            await expect(matchService.addGoal(1, 'home', 42)).rejects.toThrow('Match terminé');

            matchModel.getMatchByPk.mockResolvedValue({ id: 1, status: 'ongoing' });
            Player.getPlayerByPk.mockResolvedValue(null);
            matchModel.addGoal.mockResolvedValue();
            await expect(matchService.addGoal(1, 'home', 42)).rejects.toThrow('Joueur non trouvé');
        });
    });

    describe('getMatchesByTeam', () => {
        it('renvoie les matchs d’une équipe depuis cache ou DB', async () => {
            redis.getClient().get.mockResolvedValue(null);
            matchModel.getAllMatches.mockResolvedValue([
                { home_team_id: 1, away_team_id: 2 },
                { home_team_id: 3, away_team_id: 1 }
            ]);

            const result = await matchService.getMatchesByTeam(1);
            expect(result).toHaveLength(2);
            expect(redis.getClient().set).toHaveBeenCalled();
        });
    });

    describe('invalidateMatchCache', () => {
        it('supprime toutes les clés cache liées aux matchs', async () => {
            const redisClient = redis.getClient();
            redisClient.keys.mockResolvedValue(['matches:score:2-1']);

            await matchService.invalidateMatchCache(1);
            expect(redisClient.del).toHaveBeenCalledWith(
                'matches',
                'match:1',
                'matches:upcoming',
                'matches:results',
                'matches:score:2-1'
            );
        });
    });
});
