const teamService = require('../../src/services/teamService');
const teamModel = require('../../src/models/teamModel');
const redis = require('../../src/loaders/redis');

jest.mock('../../src/models/teamModel');

const mockRedisClient = {
    get: jest.fn(),
    set: jest.fn()
};

jest.mock('../../src/loaders/redis', () => ({
    getClient: jest.fn(() => mockRedisClient)
}));

describe('teamService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRedisClient.get.mockReset();
        mockRedisClient.set.mockReset();
    });

    describe('getAllTeams', () => {
        it('renvoie les équipes depuis Redis si présentes', async () => {
            const fakeTeams = [{ id: 1, name: 'Team A' }];
            mockRedisClient.get.mockResolvedValue(JSON.stringify(fakeTeams));

            const result = await teamService.getAllTeams();
            expect(result).toEqual(fakeTeams);
            expect(mockRedisClient.get).toHaveBeenCalledWith('teams');
        });

        it('récupère les équipes depuis la DB si pas en cache', async () => {
            const fakeTeams = [{ id: 1, name: 'Team A' }];
            mockRedisClient.get.mockResolvedValue(null);
            teamModel.getAllTeams.mockResolvedValue(fakeTeams);

            const result = await teamService.getAllTeams();

            expect(result).toEqual(fakeTeams);
            expect(mockRedisClient.set).toHaveBeenCalledWith('teams', JSON.stringify(fakeTeams), 'EX', 300);
        });
    });

    describe('getTeamById', () => {
        it('renvoie une équipe depuis Redis si présente', async () => {
            const team = { id: 2, name: 'Team B' };
            mockRedisClient.get.mockResolvedValue(JSON.stringify(team));

            const result = await teamService.getTeamById(2);
            expect(result).toEqual(team);
            expect(mockRedisClient.get).toHaveBeenCalledWith('team:2');
        });

        it('récupère une équipe depuis la DB si pas en cache', async () => {
            const team = { id: 3, name: 'Team C' };
            mockRedisClient.get.mockResolvedValue(null);
            teamModel.getTeamByPk.mockResolvedValue(team);

            const result = await teamService.getTeamById(3);

            expect(result).toEqual(team);
            expect(mockRedisClient.set).toHaveBeenCalledWith('team:3', JSON.stringify(team), 'EX', 300);
        });

        it('renvoie null si l’équipe n’existe pas en DB', async () => {
            mockRedisClient.get.mockResolvedValue(null);
            teamModel.getTeamByPk.mockResolvedValue(null);

            const result = await teamService.getTeamById(99);
            expect(result).toBeNull();
        });
    });

    describe('getTeamByName', () => {
        it('renvoie une équipe depuis Redis si présente', async () => {
            const team = { id: 4, name: 'Team D' };
            mockRedisClient.get.mockResolvedValue(JSON.stringify(team));

            const result = await teamService.getTeamByName('Team D');
            expect(result).toEqual(team);
            expect(mockRedisClient.get).toHaveBeenCalledWith('team:name:Team D');
        });

        it('récupère une équipe depuis la DB si pas en cache', async () => {
            const team = { id: 5, name: 'Team E' };
            mockRedisClient.get.mockResolvedValue(null);
            teamModel.getTeamByName.mockResolvedValue(team);

            const result = await teamService.getTeamByName('Team E');

            expect(result).toEqual(team);
            expect(mockRedisClient.set).toHaveBeenCalledWith('team:name:Team E', JSON.stringify(team), 'EX', 300);
        });

        it('renvoie null si aucune équipe ne correspond', async () => {
            mockRedisClient.get.mockResolvedValue(null);
            teamModel.getTeamByName.mockResolvedValue(null);

            const result = await teamService.getTeamByName('Unknown Team');
            expect(result).toBeNull();
        });
    });
});
