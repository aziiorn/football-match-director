const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('winamax', 'root', 'Root@1234', {
  host: 'localhost',
  dialect: 'mysql',
  dialectOptions: {
    charset: 'utf8mb4',
    supportBigNumbers: true,
    bigNumberStrings: true
  },
  logging: false,
});

module.exports = sequelize;