const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/mysql');

const Match = sequelize.define('Match', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  home_team_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'teams',
      key: 'id'
    },
  },
  away_team_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'teams',
      key: 'id'
    },
  },
  homeTeamScore: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  awayTeamScore: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('upcoming', 'ongoing', 'finished'),
    defaultValue: 'upcoming',
    allowNull: false
  }
}, {
  tableName: 'matches',
  timestamps: false
});

/**
 * Récupère tous les matchs avec les options spécifiées.
 * @param {Object} [options] - Options pour filtrer les résultats de la recherche.
 * @returns {Promise<Array>} Une promesse qui résout avec un tableau de matchs.
 */
function getAllMatches(options) {
  return Match.findAll(options);
}

/**
* Récupère un match par sa clé primaire.
* @param {number} pk - Clé primaire du match.
* @returns {Promise<Object|null>} Une promesse qui résout avec le match correspondant ou null si non trouvé.
*/
function getMatchByPk(pk) {
  return Match.findByPk(pk);
}

/**
* Récupère un seul match correspondant aux options spécifiées.
* @param {Object} options - Options pour filtrer les résultats de la recherche.
* @returns {Promise<Object|null>} Une promesse qui résout avec le match trouvé ou null si aucun ne correspond.
*/
function getOneMatch(options) {
  return Match.findOne(options);
}

/**
* Crée un nouveau match avec les attributs spécifiés.
* @param {Object} attributes - Les attributs du match à créer.
* @returns {Promise<Object>} Une promesse qui résout avec le match créé.
*/
function createMatch(attributes) {
  return Match.create(attributes);
}

function updateMatch(match, date, homeTeamScore, awayTeamScore, status) {
  if (date !== null && date !== undefined) {
    match.date = date;
  }

  if (homeTeamScore !== null && homeTeamScore !== undefined) {
    match.homeTeamScore = homeTeamScore;
  }

  if (awayTeamScore !== null && awayTeamScore !== undefined) {
    match.awayTeamScore = awayTeamScore;
  }

  if (status !== null && status !== undefined) {
    const currentStatus = match.status;

    const isValidTransition =
        (currentStatus === 'upcoming' && status === 'ongoing') ||
        (currentStatus === 'ongoing' && status === 'finished');

    if (!isValidTransition) {
      throw new Error(`Transition de statut invalide : "${currentStatus}" ➝ "${status}"`);
    }

    match.status = status;
  }

  return match.save();
}

function deleteMatch(match) {
  match.destroy();
}

async function addGoal(match, team) {
  if (match.home_team_id === team) {
    if (match.homeTeamScore === null) match.homeTeamScore = 0;
    match.homeTeamScore += 1;
  } else if (match.away_team_id === team) {
    if (match.awayTeamScore === null) match.awayTeamScore = 0;
    match.awayTeamScore += 1;
  }
  await match.save();
}

module.exports = {
  getAllMatches,
  getMatchByPk,
  getOneMatch,
  createMatch,
  updateMatch,
  deleteMatch,
  addGoal,
}