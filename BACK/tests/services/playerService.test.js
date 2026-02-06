const playerService = require('../../src/services/playerService');
const playerModel = require('../../src/models/playerModel');
const redis = require('../../src/loaders/redis');

jest.mock('../../src/models/playerModel');

const mockRedisClient = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
    lrange: jest.fn(),
    lpop: jest.fn(),
    rpush: jest.fn(),
    publish: jest.fn()
};

jest.mock('../../src/loaders/redis', () => ({
    getClient: jest.fn(() => mockRedisClient),
}));

describe('playerService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllPlayers', () => {
        it('retourne les joueurs depuis Redis si dispo', async () => {
            const players = [{ id: 1, name: 'Zidane' }];
            mockRedisClient.get.mockResolvedValue(JSON.stringify(players));

            const result = await playerService.getAllPlayers();
            expect(result).toEqual(players);
        });

        it('retourne les joueurs depuis la DB si pas en cache', async () => {
            const players = [{ id: 2, name: 'Henry' }];
            mockRedisClient.get.mockResolvedValue(null);
            playerModel.getAllPlayers.mockResolvedValue(players);

            const result = await playerService.getAllPlayers();
            expect(result).toEqual(players);
            expect(mockRedisClient.set).toHaveBeenCalled();
        });
    });

    describe('getPlayerById', () => {
        it('utilise Redis si dispo', async () => {
            const player = { id: 1, name: 'Mbappé' };
            mockRedisClient.get.mockResolvedValue(JSON.stringify(player));
            playerModel.getPlayerByPk.mockResolvedValue(player);

            const result = await playerService.getPlayerById(1);
            expect(result).toEqual(player);
        });

        it('charge depuis DB et met en cache sinon', async () => {
            const player = { id: 2, name: 'Kanté' };
            mockRedisClient.get.mockResolvedValue(null);
            playerModel.getPlayerByPk.mockResolvedValue(player);

            const result = await playerService.getPlayerById(2);
            expect(result).toEqual(player);
            expect(mockRedisClient.set).toHaveBeenCalled();
        });
    });

    describe('createPlayer', () => {
        it('crée un joueur et invalide les caches', async () => {
            playerModel.createPlayer.mockResolvedValue({ id: 1, name: 'Griezmann' });
            mockRedisClient.keys.mockResolvedValue(['players:position:Forward']);

            const result = await playerService.createPlayer('Griezmann', 'Forward', 7);
            expect(result.name).toBe('Griezmann');
            expect(mockRedisClient.del).toHaveBeenCalled();
        });
    });

    describe('updatePlayer', () => {
        it('met à jour un joueur et invalide le cache', async () => {
            const player = { id: 1 };
            playerModel.getPlayerByPk.mockResolvedValue(player);
            playerModel.updatePlayer.mockResolvedValue({ id: 1, name: 'Modric' });
            mockRedisClient.keys.mockResolvedValue([]);

            const result = await playerService.updatePlayer(1, 'Modric', 'Midfielder', 10, 5, 3);
            expect(result.name).toBe('Modric');
            expect(mockRedisClient.del).toHaveBeenCalled();
        });
    });

    describe('deletePlayer', () => {
        it('supprime un joueur et invalide le cache', async () => {
            const player = { id: 3 };
            playerModel.getPlayerByPk.mockResolvedValue(player);
            playerModel.deletePlayer.mockResolvedValue(true);
            mockRedisClient.keys.mockResolvedValue([]);

            const result = await playerService.deletePlayer(3);
            expect(result).toBe(true);
            expect(mockRedisClient.del).toHaveBeenCalled();
        });
    });

    describe('getTopScorers', () => {
        it('retourne les meilleurs buteurs', async () => {
            mockRedisClient.get.mockResolvedValue(null);
            playerModel.getAllPlayers.mockResolvedValue([
                { name: 'A', goalsScored: 5, assists: 2 },
                { name: 'B', goalsScored: 8, assists: 1 },
                { name: 'C', goalsScored: 3, assists: 5 },
                { name: 'D', goalsScored: 7, assists: 3 }
            ]);

            const result = await playerService.getTopScorers();
            expect(result.map(p => p.name)).toEqual(['B', 'D', 'A']);
            expect(mockRedisClient.set).toHaveBeenCalled();
        });
    });

    describe('getPlayersByPosition', () => {
        it('retourne les joueurs par poste depuis la DB si pas en cache', async () => {
            mockRedisClient.get.mockResolvedValue(null);
            playerModel.getAllPlayers.mockResolvedValue([{ name: 'Lloris', position: 'Goalkeeper' }]);

            const result = await playerService.getPlayersByPosition('Goalkeeper');
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Lloris');
            expect(mockRedisClient.set).toHaveBeenCalled();
        });
    });

    describe('injured / recovered', () => {
        it('ajoute un joueur à la liste des blessés', async () => {
            const player = { id: 9, name: 'Coman' };
            playerModel.getPlayerByPk.mockResolvedValue(player);
            mockRedisClient.lrange.mockResolvedValue([]);

            await playerService.injured(9);
            expect(mockRedisClient.rpush).toHaveBeenCalledWith('players:injured', 9);
            expect(mockRedisClient.publish).toHaveBeenCalledWith('player:injured', JSON.stringify({ playerId: 9 }));
        });

        it('retire un joueur blessé (recovered)', async () => {
            const player = { id: 4, name: 'Giroud' };
            mockRedisClient.lpop.mockResolvedValue('4');
            playerModel.getPlayerByPk.mockResolvedValue(player);

            const result = await playerService.recovered();
            expect(result.name).toBe('Giroud');
            expect(mockRedisClient.publish).toHaveBeenCalledWith('player:recovered', JSON.stringify({ playerId: "4" }));
        });
    });
});
