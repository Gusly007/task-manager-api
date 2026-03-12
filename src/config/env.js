require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/task-manager',
  JWT_SECRET: process.env.JWT_SECRET || 'changeme',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
