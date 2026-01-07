const express = require('express');
const router = express.Router();
const { getMyTasks, getAllProjects, updateTaskStatus } = require('../controllers/teamController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('team', 'admin'));

router.get('/tasks', getMyTasks);
router.get('/projects', getAllProjects);
router.patch('/tasks/:taskId', updateTaskStatus);

module.exports = router;
