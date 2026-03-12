const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middlewares/authMiddleware');
const { validateCreateTask, validateUpdateTask } = require('../validators/taskValidator');
const validate = require('../middlewares/validateMiddleware');

router.use(auth);

router.post('/', validateCreateTask, validate, taskController.create);
router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);
router.put('/:id', validateUpdateTask, validate, taskController.update);
router.delete('/:id', taskController.remove);

module.exports = router;
