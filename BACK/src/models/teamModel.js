const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/mysql');
const { get } = require('../routes/player');

const Team = sequelize.define('Team', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'teams',
    timestamps: false,
});

function getAllTeams() {
    return Team.findAll();
}

function getTeamByPk(pk) {
    return Team.findByPk(pk);
}

function getTeamByName(name) {
    return Team.findAll({
        where: {
            name: name,
        },
    });
}

module.exports = {
    getAllTeams,
    getTeamByPk,
    getTeamByName
};