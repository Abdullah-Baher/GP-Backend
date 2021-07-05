const express = require('express');
const TasksController = require('../controllers/tasks_controller');
const auth = require('../middleware/auth');
const taskCheck = require('../middleware/taskCheck');

const router = express.Router();

router.post('/tasks', auth, TasksController.postTask);

router.patch('/tasks/:taskId', [auth, taskCheck], TasksController.updateTask);

router.patch('/tasks/add/:taskId', [auth, taskCheck], TasksController.addMemberToTask);

router.patch('/tasks/remove/:taskId', [auth, taskCheck], TasksController.removeMemberFromTask);

router.patch('/tasks/comment/add/:taskId', [auth, taskCheck], TasksController.addComment);

router.get('/tasks', auth, TasksController.getTasks);

router.get('/tasks/:taskId', auth, TasksController.getTaskById);

router.delete('/tasks/:taskId', [auth, taskCheck], TasksController.deleteTask);


module.exports = router;