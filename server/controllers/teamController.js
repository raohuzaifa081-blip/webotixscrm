const {
  getTasksForTeamMember,
  updateTaskStatus,
  getTaskById
} = require('../data');

exports.getMyTasks = async (req, res) => {
  const tasks = getTasksForTeamMember(req.user.id);
  res.json(tasks);
};

exports.updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  const task = getTaskById(taskId);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  if (task.assignedTo !== req.user.id) {
    return res.status(403).json({ message: 'You can only update your own tasks' });
  }

  const updated = updateTaskStatus(taskId, status);
  res.json(updated);
};
