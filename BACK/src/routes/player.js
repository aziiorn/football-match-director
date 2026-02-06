const express = require('express');
const router = express.Router();
const authenticate = require("../middleware/auth");
const authorizeRole = require("../middleware/role");

const playerController = require('../controllers/playerController');

/**
 * @swagger
 * tags:
 *   name: Players
 *   description: API de gestion des joueurs
 */

/**
 * @swagger
 * /players/topScorers:
 *   get:
 *     summary: Récupère les meilleurs buteurs
 *     tags: [Players]
 *     responses:
 *       200:
 *         description: Liste des meilleurs buteurs
 *       401:
 *         description: Non autorisé
 */
router.get('/topScorers', authenticate, playerController.topScorers);

/**
 * @swagger
 * /players/position/{position}:
 *   get:
 *     summary: Récupère les joueurs par position
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: position
 *         required: true
 *         schema:
 *           type: string
 *         description: "La position du joueur (ex: Midfielder)"
 *     responses:
 *       200:
 *         description: Liste des joueurs correspondant à la position
 *       401:
 *         description: Non autorisé
 */

router.get('/position/:position', authenticate, playerController.position);

/**
 * @swagger
 * /players/team/{team}:
 *   get:
 *     summary: Récupère les joueurs d'une équipe
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: team
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID de l'équipe
 *     responses:
 *       200:
 *         description: Liste des joueurs de l'équipe
 *       401:
 *         description: Non autorisé
 */
router.get('/team/:team', authenticate, playerController.team);

/**
 * @swagger
 * /players/stats:
 *   get:
 *     summary: Statistiques cumulées des joueurs
 *     tags: [Players]
 *     responses:
 *       200:
 *         description: Statistiques des joueurs (buts, passes, contributions)
 *       401:
 *         description: Non autorisé
 */
router.get('/stats', authenticate, playerController.stats);

/**
 * @swagger
 * /players/injured/{id}:
 *   get:
 *     summary: Marque un joueur comme blessé
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du joueur à marquer blessé
 *     responses:
 *       200:
 *         description: Joueur marqué blessé
 *       404:
 *         description: Joueur non trouvé
 *       401:
 *         description: Non autorisé
 */
router.get('/injured/:id', authorizeRole('admin'), authenticate, playerController.injured);

/**
 * @swagger
 * /players/recovered:
 *   get:
 *     summary: Retire un joueur de la liste des blessés
 *     tags: [Players]
 *     responses:
 *       200:
 *         description: Joueur retiré de la liste
 *       404:
 *         description: Aucun joueur blessé
 *       401:
 *         description: Non autorisé
 */
router.get('/recovered', authorizeRole('admin'), authenticate, playerController.recovered);

/**
 * @swagger
 * /players:
 *   get:
 *     summary: Retrieve a list of all players
 *     tags: 
 *       - Players
 *     responses:
 *       200:
 *         description: A list of players
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The player ID
 *                   name:
 *                     type: string
 *                     description: The player's name
 *                   position:
 *                     type: string
 *                     description: The player's position
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticate, playerController.getAllPlayers);

/**
 * @swagger
 * /players/{id}:
 *   get:
 *     summary: Retrieve a player by ID
 *     tags:
 *       - Players
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The player ID
 *     responses:
 *       200:
 *         description: A single player
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The player ID
 *                 name:
 *                   type: string
 *                   description: The player's name
 *                 position:
 *                   type: string
 *                   description: The player's position
 *       404:
 *         description: Player not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticate, playerController.getPlayerById);

/**
 * @swagger
 * /players:
 *   post:
 *     summary: Create a new player
 *     tags:
 *       - Players
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The player's name
 *                 example: "Roy Kent"
 *               position:
 *                 type: string
 *                 description: The player's position
 *                 example: "Midfielder"
 *     responses:
 *       201:
 *         description: Player created successfully
 *       400:
 *         description: Invalid input (e.g., missing name or position)
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticate, authorizeRole('admin'), playerController.createPlayer);

/**
 * @swagger
 * /players/{id}:
 *   put:
 *     summary: Update a player's details
 *     tags:
 *       - Players
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The player ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The player's name
 *                 example: "Roy Kent"
 *               position:
 *                 type: string
 *                 description: The player's position
 *                 example: "Midfielder"
 *     responses:
 *       200:
 *         description: Player updated successfully
 *       400:
 *         description: Invalid input (e.g., missing name or position)
 *       404:
 *         description: Player not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticate, authorizeRole('admin'), playerController.updatePlayer);

/**
 * @swagger
 * /players/{id}:
 *   delete:
 *     summary: Delete a player by ID
 *     tags:
 *       - Players
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The player ID
 *     responses:
 *       200:
 *         description: Player deleted successfully
 *       404:
 *         description: Player not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticate, authorizeRole('admin'), playerController.deletePlayer);

module.exports = router;
