const User = require('../models/userModel');

async function getUserById(id) {
    return User.findByPk(id);
}

async function updateUserBalance(userId, amountDelta) {
    const user = await getUserById(userId);
    if (!user) throw new Error('User not found');
    user.balance += amountDelta;
    await user.save();
}

module.exports = {
    getUserById,
    updateUserBalance
};