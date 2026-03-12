const User = require('../models/User');

exports.create = async (data) => {
  return User.create(data);
};

exports.findByEmail = async (email) => {
  return User.findOne({ email });
};

exports.findById = async (id) => {
  return User.findById(id).select('-password');
};
