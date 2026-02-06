const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/mysql');

const Player = sequelize.define('Player', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  goalsScored: {
    type: DataTypes.INTEGER,
  },
  assists: {
    type: DataTypes.INTEGER,
  },
  team_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'teams',
      key: 'id'
    },
  }
}, {
  tableName: 'players',
  timestamps: false
});

function getAllPlayers(options) {
  return Player.findAll(options);
}

function getPlayerByPk(pk) {
  return Player.findByPk(pk);
}

function getOnePlayer(options) {
  return Player.findOne(options);
}

function createPlayer(attributes) {
  return Player.create(attributes);
}

async function updatePlayer(player, name, position, number, goalsScored, assists) {
  if (name) player.name = name;
  if (position) player.position = position;
  if (number) player.number = number;
  if (goalsScored !== undefined) player.goalsScored = goalsScored;
  if (assists !== undefined) player.assists = assists;

  await player.save();
}

async function deletePlayer(player) {
  await player.destroy();
}

module.exports = {
  getAllPlayers,
  getPlayerByPk,
  getOnePlayer,
  createPlayer,
  updatePlayer,
  deletePlayer
};