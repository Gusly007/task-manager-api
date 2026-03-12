const Task = require('../models/Task');

exports.create = async (data) => {
  return Task.create(data);
};

exports.findAllByUser = async (userId) => {
  return Task.find({ user: userId }).sort({ createdAt: -1 });
};

exports.findById = async (id) => {
  return Task.findById(id);
};

exports.update = async (id, data) => {
  return Task.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

exports.remove = async (id) => {
  return Task.findByIdAndDelete(id);
};
