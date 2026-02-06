const oddService = require('../../src/services/oddService');
const oddModel = require('../../src/models/oddModel');
const redis = require('../../src/loaders/redis');

jest.mock('../../src/models/oddModel');

const mockRedisClient = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
};

jest.mock('../../src/loaders/redis', () => ({
    getClient: jest.fn(() => mockRedisClient),
}));

describe('oddService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRedisClient.get.mockReset();
        mockRedisClient.set.mockReset();
        mockRedisClient.del.mockReset();
    });

    describe('getAllOdds', () => {
        it('retourne les cotes depuis le cache si dispo', async () => {
            const fakeOdds = [{ id: 1 }];
            mockRedisClient.get.mockResolvedValue(JSON.stringify(fakeOdds));

            const result = await oddService.getAllOdds();
            expect(result).toEqual(fakeOdds);
        });

        it('récupère les cotes depuis la DB si non en cache', async () => {
            mockRedisClient.get.mockResolvedValue(null);
            oddModel.getAllOdds.mockResolvedValue([{ id: 2 }]);

            const result = await oddService.getAllOdds();
            expect(result).toEqual([{ id: 2 }]);
            expect(mockRedisClient.set).toHaveBeenCalled();
        });
    });

    describe('getOddsByMatchId', () => {
        it('retourne les cotes depuis le cache si dispo', async () => {
            const odds = { match_id: 5, home_win: 1.5 };
            mockRedisClient.get.mockResolvedValue(JSON.stringify(odds));

            const result = await oddService.getOddsByMatchId(5);
            expect(result).toEqual(odds);
        });

        it('récupère les cotes depuis la DB si non en cache', async () => {
            mockRedisClient.get.mockResolvedValue(null);
            const odds = { match_id: 5, home_win: 2.0 };
            oddModel.getOddsByMatchId.mockResolvedValue(odds);

            const result = await oddService.getOddsByMatchId(5);
            expect(result).toEqual(odds);
            expect(mockRedisClient.set).toHaveBeenCalled();
        });
    });

    describe('createOdds', () => {
        it('crée de nouvelles cotes et invalide le cache', async () => {
            const newOdds = { id: 10, match_id: 1 };
            oddModel.createOdds.mockResolvedValue(newOdds);

            const result = await oddService.createOdds(1, 1.5, 3.2, 2.4);
            expect(result).toEqual(newOdds);
            expect(mockRedisClient.del).toHaveBeenCalledWith('odds:all', 'odds:match:1');
        });
    });

    describe('updateOdds', () => {
        it('met à jour les cotes existantes et invalide le cache', async () => {
            const existingOdds = { id: 99 };
            const updated = { id: 99, home_win: 1.7 };

            oddModel.getOddsByMatchId.mockResolvedValue(existingOdds);
            oddModel.updateOdds.mockResolvedValue(updated);

            const result = await oddService.updateOdds(1, 1.7, 2.5, 2.8);
            expect(result).toEqual(updated);
            expect(mockRedisClient.del).toHaveBeenCalledWith('odds:all', 'odds:match:1');
        });

        it('lève une erreur si les cotes n’existent pas', async () => {
            oddModel.getOddsByMatchId.mockResolvedValue(null);

            await expect(oddService.updateOdds(1, 1.7, 2.5, 2.8)).rejects.toThrow('Odds not found');
        });
    });

    describe('deleteOdds', () => {
        it('supprime les cotes existantes et invalide le cache', async () => {
            const existingOdds = { id: 42 };
            oddModel.getOddsByMatchId.mockResolvedValue(existingOdds);

            await oddService.deleteOdds(1);
            expect(oddModel.deleteOdds).toHaveBeenCalledWith(existingOdds);
            expect(mockRedisClient.del).toHaveBeenCalledWith('odds:all', 'odds:match:1');
        });

        it('lève une erreur si les cotes n’existent pas', async () => {
            oddModel.getOddsByMatchId.mockResolvedValue(null);

            await expect(oddService.deleteOdds(1)).rejects.toThrow('Odds not found');
        });
    });
});
