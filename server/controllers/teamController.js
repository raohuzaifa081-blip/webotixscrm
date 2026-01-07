const {
  getTasksForTeamMember,
  getAllProjectsWithTasks,
  updateTaskStatus,
  getTaskById
} = require('../data');

exports.getMyTasks = async (req, res) => {
  const tasks = getTasksForTeamMember(req.user.id);
  res.json(tasks);
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = getAllProjectsWithTasks();
    // Mark which tasks can be updated by this team member
    const projectsWithPermissions = projects.map((project) => ({
      ...project,
      tasks: project.tasks.map((task) => ({
        ...task,
        canUpdate: task.assignedTo === req.user.id
      }))
    }));
    res.json(projectsWithPermissions);
  } catch (error) {
    console.error('Error getting all projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
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
