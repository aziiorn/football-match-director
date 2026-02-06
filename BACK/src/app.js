const express = require('express');
const { swaggerUi, swaggerDocs } = require("./loaders/swagger");
const cors = require('cors');

const app = express();

const playerRoutes = require('./routes/player');
const matchRoutes = require('./routes/match');
const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/team');
const oddRoutes = require('./routes/odd');
const betRoutes = require('./routes/bet');

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/players', playerRoutes);
app.use('/matches', matchRoutes);
app.use('/teams', teamRoutes);
app.use('/odds', oddRoutes);
app.use('/bets', betRoutes);
app.use('/login', authRoutes);

module.exports = app;