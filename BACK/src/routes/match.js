const express = require('express');
const router = express.Router();
const authenticate = require("../middleware/auth");
const authorizeRole = require("../middleware/role");

const matchController = require('../controllers/matchController');

/**
 * @swagger
 * tags:
 *   name: Matches
 *   description: Gestion des matchs
 */

/**
 * @swagger
 * /matches/team/{team}:
 *   get:
 *     summary: Récupère tous les matchs d'une équipe
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: team
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'équipe
 *     responses:
 *       200:
 *         description: Liste des matchs
 *       401:
 *         description: Non autorisé
 */
router.get('/team/:team', authenticate, matchController.teamMatches);

/**
 * @swagger
 * /matches/upcoming:
 *   get:
 *     summary: Récupère les matchs à venir
 *     tags: [Matches]
 *     responses:
 *       200:
 *         description: Liste des matchs à venir
 *       401:
 *         description: Non autorisé
 */
router.get('/upcoming', authenticate, matchController.upcoming);

/**
 * @swagger
 * /matches/results:
 *   get:
 *     summary: Récupère les résultats des matchs terminés
 *     tags: [Matches]
 *     responses:
 *       200:
 *         description: Liste des résultats
 *       401:
 *         description: Non autorisé
 */
router.get('/results', authenticate, matchController.results);

/**
 * @swagger
 * /matches/score/{score}:
 *   get:
 *     summary: Récupère les matchs avec un score spécifique
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: score
 *         required: true
 *         schema:
 *           type: string
 *         description: Score au format "2-1"
 *     responses:
 *       200:
 *         description: Liste des matchs
 *       401:
 *         description: Non autorisé
 */
router.get('/score/:score', authenticate, matchController.score);

/**
 * @swagger
 * /matches:
 *   get:
 *     summary: Récupère tous les matchs
 *     tags: [Matches]
 *     responses:
 *       200:
 *         description: Liste des matchs
 *       401:
 *         description: Non autorisé
 */
router.get('/', authenticate, matchController.getAllMatches);

/**
 * @swagger
 * /matches/{id}:
 *   get:
 *     summary: Récupère un match par son ID
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du match
 *     responses:
 *       200:
 *         description: Match trouvé
 *       404:
 *         description: Match non trouvé
 *       401:
 *         description: Non autorisé
 */
router.get('/:id', authenticate, matchController.getMatchById);

/**
 * @swagger
 * /matches/goal/{id}:
 *   post:
 *     summary: Enregistre un but pour un match
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du match
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               team:
 *                 type: string
 *                 enum: [home, away]
 *                 example: home
 *     responses:
 *       200:
 *         description: But enregistré
 *       404:
 *         description: Match non trouvé
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès interdit
 */
router.post('/goal/:id', authenticate, authorizeRole('admin'), matchController.goal);

/**
 * @swagger
 * /matches:
 *   post:
 *     summary: Crée un nouveau match
 *     tags: [Matches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               home_team_id:
 *                 type: integer
 *                 example: 1
 *               away_team_id:
 *                 type: integer
 *                 example: 2
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-07-20T18:00:00Z"
 *     responses:
 *       201:
 *         description: Match créé
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès interdit
 */
router.post('/', authenticate, authorizeRole('admin'), matchController.createMatch);

/**
 * @swagger
 * /matches/{id}:
 *   put:
 *     summary: Met à jour un match
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du match
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               homeTeamScore:
 *                 type: integer
 *               awayTeamScore:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [upcoming, ongoing, finished]
 *     responses:
 *       200:
 *         description: Match mis à jour
 *       404:
 *         description: Match non trouvé
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès interdit
 */
router.put('/:id', authenticate, authorizeRole('admin'), matchController.updateMatch);

/**
 * @swagger
 * /matches/{id}:
 *   delete:
 *     summary: Supprime un match
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du match
 *     responses:
 *       200:
 *         description: Match supprimé
 *       404:
 *         description: Match non trouvé
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès interdit
 */
router.delete('/:id', authenticate, authorizeRole('admin'), matchController.deleteMatch);

module.exports = router;