const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/mysql');

const Bet = sequelize.define('Bet', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    match_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bet_type: {
        type: DataTypes.ENUM('home_win', 'draw', 'away_win'),
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    odds_at_bet_time: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'won', 'lost'),
        defaultValue: 'pending'
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'bets',
    timestamps: false
});

module.exports = Bet;