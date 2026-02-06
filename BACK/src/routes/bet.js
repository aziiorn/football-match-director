const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const betController = require('../controllers/betController');

/**
 * @swagger
 * tags:
 *   name: Bets
 *   description: Gestion des paris utilisateurs
 */

/**
 * @swagger
 * /bets:
 *   post:
 *     summary: Crée un nouveau pari pour l'utilisateur connecté
 *     tags: [Bets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - matchId
 *               - betType
 *               - amount
 *             properties:
 *               matchId:
 *                 type: integer
 *                 description: ID du match concerné
 *                 example: 1
 *               betType:
 *                 type: string
 *                 enum: [home_win, draw, away_win]
 *                 description: Type de pari
 *                 example: home_win
 *               amount:
 *                 type: number
 *                 description: Montant misé
 *                 example: 50
 *     responses:
 *       201:
 *         description: Pari créé avec succès
 *       400:
 *         description: Données invalides ou pari refusé
 *       401:
 *         description: Non autorisé
 */
router.post('/', authenticate, betController.createBet);

/**
 * @swagger
 * /bets:
 *   get:
 *     summary: Récupère les paris de l'utilisateur connecté, triés par date décroissante
 *     tags: [Bets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des paris de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   match_id:
 *                     type: integer
 *                   bet_type:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   odds_at_bet_time:
 *                     type: number
 *                   status:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Non autorisé
 */
router.get('/', authenticate, betController.getBetsByUser);

module.exports = router;
