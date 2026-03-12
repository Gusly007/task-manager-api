const { body } = require('express-validator');

exports.validateCreateTask = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'done'])
    .withMessage('Status must be todo, in-progress, or done'),
];

exports.validateUpdateTask = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim(),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'done'])
    .withMessage('Status must be todo, in-progress, or done'),
];
