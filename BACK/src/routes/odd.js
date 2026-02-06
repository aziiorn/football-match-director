const express = require('express');
const router = express.Router();
const authenticate = require("../middleware/auth");
const authorizeRole = require("../middleware/role");

const oddsController = require('../controllers/oddController');

/**
 * @swagger
 * tags:
 *   name: Odds
 *   description: Gestion des cotes de matchs
 */

/**
 * @swagger
 * /odds:
 *   get:
 *     summary: Récupère toutes les cotes
 *     tags: [Odds]
 *     responses:
 *       200:
 *         description: "Liste de toutes les cotes"
 *       401:
 *         description: "Non autorisé"
 *       500:
 *         description: "Erreur serveur"
 */
router.get('/', authenticate, oddsController.getAllOdds);

/**
 * @swagger
 * /odds/{matchId}:
 *   get:
 *     summary: Récupère les cotes d'un match
 *     tags: [Odds]
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID du match"
 *     responses:
 *       200:
 *         description: "Cotes du match"
 *       404:
 *         description: "Match ou cotes non trouvés"
 *       401:
 *         description: "Non autorisé"
 */
router.get('/:matchId', authenticate, oddsController.getOddsByMatchId);

/**
 * @swagger
 * /odds:
 *   post:
 *     summary: Crée les cotes d'un match
 *     tags: [Odds]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - match_id
 *               - home_win
 *               - draw
 *               - away_win
 *             properties:
 *               match_id:
 *                 type: integer
 *                 example: 1
 *               home_win:
 *                 type: number
 *                 example: 1.8
 *               draw:
 *                 type: number
 *                 example: 3.2
 *               away_win:
 *                 type: number
 *                 example: 2.1
 *     responses:
 *       201:
 *         description: "Cotes créées"
 *       400:
 *         description: "Données invalides"
 *       401:
 *         description: "Non autorisé"
 *       403:
 *         description: "Accès interdit"
 */
router.post('/', authenticate, authorizeRole('admin'), oddsController.createOdds);

/**
 * @swagger
 * /odds/{matchId}:
 *   put:
 *     summary: Met à jour les cotes d’un match
 *     tags: [Odds]
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID du match"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - home_win
 *               - draw
 *               - away_win
 *             properties:
 *               home_win:
 *                 type: number
 *                 example: 1.6
 *               draw:
 *                 type: number
 *                 example: 3.5
 *               away_win:
 *                 type: number
 *                 example: 2.4
 *     responses:
 *       200:
 *         description: "Cotes mises à jour"
 *       404:
 *         description: "Cotes non trouvées"
 *       401:
 *         description: "Non autorisé"
 *       403:
 *         description: "Accès interdit"
 */
router.put('/:matchId', authenticate, authorizeRole('admin'), oddsController.updateOdds);

/**
 * @swagger
 * /odds/{matchId}:
 *   delete:
 *     summary: Supprime les cotes d’un match
 *     tags: [Odds]
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID du match"
 *     responses:
 *       200:
 *         description: "Cotes supprimées"
 *       404:
 *         description: "Cotes non trouvées"
 *       401:
 *         description: "Non autorisé"
 *       403:
 *         description: "Accès interdit"
 */
router.delete('/:matchId', authenticate, authorizeRole('admin'), oddsController.deleteOdds);

module.exports = router;
