const { Task } = require('../models');

exports.create = async (data) => {
  return Task.create(data);
};

exports.findAllByUser = async (userId) => {
  return Task.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
  });
};

exports.findById = async (id) => {
  return Task.findByPk(id);
};

exports.update = async (id, data) => {
  const task = await Task.findByPk(id);
  if (!task) return null;
  return task.update(data);
};

exports.remove = async (id) => {
  const task = await Task.findByPk(id);
  if (!task) return null;
  await task.destroy();
  return task;
};
