const express = require('express');
const router = express.Router();
const authenticate = require("../middleware/auth");

const teamController = require('../controllers/teamController');

/**
 * @swagger
 * tags:
 *   name: Teams
 *   description: API de gestion des équipes
 */

/**
 * @swagger
 * /teams:
 *   get:
 *     summary: Retrieve a list of all teams
 *     tags:
 *       - Teams
 *     responses:
 *       200:
 *         description: A list of teams
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The team ID
 *                   name:
 *                     type: string
 *                     description: The team name
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticate, teamController.getAllTeams);

/**
 * @swagger
 * /teams/{id}:
 *   get:
 *     summary: Retrieve a team by ID
 *     tags:
 *       - Teams
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The team ID
 *     responses:
 *       200:
 *         description: A single team
 *       404:
 *         description: Team not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticate, teamController.getTeamById);

/**
 * @swagger
 * /teams/name/{name}:
 *   get:
 *     summary: Retrieve a team by name
 *     tags:
 *       - Teams
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The team name
 *     responses:
 *       200:
 *         description: A single team
 *       404:
 *         description: Team not found
 *       500:
 *         description: Internal server error
 */
router.get('/name/:name', authenticate, teamController.getTeamByName);

module.exports = router;