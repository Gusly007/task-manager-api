const taskRepository = require('../repositories/taskRepository');
const ApiError = require('../utils/apiError');

exports.create = async (userId, data) => {
  return taskRepository.create({ ...data, userId });
};

exports.getAllByUser = async (userId) => {
  return taskRepository.findAllByUser(userId);
};

exports.getById = async (taskId, userId) => {
  const task = await taskRepository.findById(taskId);
  if (!task || task.userId !== userId) {
    throw new ApiError(404, 'Task not found');
  }
  return task;
};

exports.update = async (taskId, userId, data) => {
  const task = await taskRepository.findById(taskId);
  if (!task || task.userId !== userId) {
    throw new ApiError(404, 'Task not found');
  }
  return taskRepository.update(taskId, data);
};

exports.remove = async (taskId, userId) => {
  const task = await taskRepository.findById(taskId);
  if (!task || task.userId !== userId) {
    throw new ApiError(404, 'Task not found');
  }
  return taskRepository.remove(taskId);
};
