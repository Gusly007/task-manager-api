const taskService = require('../services/taskService');

exports.create = async (req, res, next) => {
  try {
    const task = await taskService.create(req.user.id, req.body);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const tasks = await taskService.getAllByUser(req.user.id);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const task = await taskService.getById(req.params.id, req.user.id);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const task = await taskService.update(req.params.id, req.user.id, req.body);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await taskService.remove(req.params.id, req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
