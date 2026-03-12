process.env.NODE_ENV = 'test';

const { sequelize } = require('../src/config/db');

module.exports = { sequelize };
