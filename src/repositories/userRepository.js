const { User } = require('../models');

exports.create = async (data) => {
  return User.create(data);
};

exports.findByEmail = async (email) => {
  return User.findOne({ where: { email } });
};

exports.findById = async (id) => {
  return User.findByPk(id, {
    attributes: { exclude: ['password'] },
  });
};
