const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/mysql');

const Odds = sequelize.define('Odds', {
    match_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'matches',
            key: 'id'
        }
    },
    home_win: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false
    },
    draw: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false
    },
    away_win: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false
    }
}, {
    tableName: 'odds',
    timestamps: false
});

/**
 * Récupère toutes les cotes avec les options spécifiées.
 * @param {Object} [options] - Options pour filtrer les résultats.
 * @returns {Promise<Array>} Une promesse résolue avec un tableau de cotes.
 */
function getAllOdds(options) {
    return Odds.findAll(options);
}

/**
 * Récupère les cotes d’un match par son ID.
 * @param {number} matchId - ID du match.
 * @returns {Promise<Object|null>} Une promesse résolue avec les cotes ou null.
 */
function getOddsByMatchId(matchId) {
    return Odds.findByPk(matchId);
}

/**
 * Récupère une seule cote correspondant aux options spécifiées.
 * @param {Object} options - Options Sequelize.
 * @returns {Promise<Object|null>} Une promesse résolue avec la cote ou null.
 */
function getOneOdds(options) {
    return Odds.findOne(options);
}

/**
 * Crée une nouvelle entrée de cote.
 * @param {Object} attributes - Attributs : match_id, home_win, draw, away_win.
 * @returns {Promise<Object>} Une promesse résolue avec la cote créée.
 */
function createOdds(attributes) {
    return Odds.create(attributes);
}

/**
 * Met à jour les cotes d’un match.
 * @param {Object} odds - Instance Sequelize d’une cote.
 * @param {number} home_win - Nouvelle cote pour victoire domicile.
 * @param {number} draw - Nouvelle cote pour nul.
 * @param {number} away_win - Nouvelle cote pour victoire extérieur.
 * @returns {Promise<Object>} Une promesse résolue après la mise à jour.
 */
function updateOdds(odds, home_win, draw, away_win) {
    if (home_win !== undefined) odds.home_win = home_win;
    if (draw !== undefined) odds.draw = draw;
    if (away_win !== undefined) odds.away_win = away_win;
    return odds.save();
}

/**
 * Supprime une entrée de cote.
 * @param {Object} odds - Instance Sequelize d’une cote.
 * @returns {Promise<void>}
 */
function deleteOdds(odds) {
    return odds.destroy();
}

module.exports = {
    getAllOdds,
    getOddsByMatchId,
    getOneOdds,
    createOdds,
    updateOdds,
    deleteOdds,
};
