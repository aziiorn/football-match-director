const userService = require('../../src/services/userService');
const User = require('../../src/models/userModel');

jest.mock('../../src/models/userModel');

describe('userService', () => {
    describe('getUserById', () => {
        it('retourne l’utilisateur s’il existe', async () => {
            const fakeUser = { id: 1, name: 'Alice' };
            User.findByPk.mockResolvedValue(fakeUser);

            const result = await userService.getUserById(1);
            expect(result).toEqual(fakeUser);
            expect(User.findByPk).toHaveBeenCalledWith(1);
        });

        it('retourne null si l’utilisateur n’existe pas', async () => {
            User.findByPk.mockResolvedValue(null);

            const result = await userService.getUserById(999);
            expect(result).toBeNull();
        });
    });

    describe('updateUserBalance', () => {
        it('met à jour le solde de l’utilisateur', async () => {
            const mockUser = { id: 1, balance: 100, save: jest.fn() };
            User.findByPk.mockResolvedValue(mockUser);

            await userService.updateUserBalance(1, 50);

            expect(mockUser.balance).toBe(150);
            expect(mockUser.save).toHaveBeenCalled();
        });

        it('lève une erreur si l’utilisateur n’existe pas', async () => {
            User.findByPk.mockResolvedValue(null);

            await expect(userService.updateUserBalance(999, 100))
                .rejects.toThrow('User not found');
        });
    });
});