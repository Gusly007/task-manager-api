const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

exports.hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

exports.comparePassword = async (plain, hashed) => {
  return bcrypt.compare(plain, hashed);
};
