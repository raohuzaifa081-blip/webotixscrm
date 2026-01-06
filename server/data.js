const { randomUUID } = require('crypto');

const users = [
  {
    id: 'admin-1',
    _id: 'admin-1',
    name: 'Aiden Cole',
    email: 'admin@webotixs.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: 'team-1',
    _id: 'team-1',
    name: 'Maya Patel',
    email: 'team@webotixs.com',
    password: 'team123',
    role: 'team',
    specialization: 'Dev'
  },
  {
    id: 'client-1',
    _id: 'client-1',
    name: 'Olivia Green',
    email: 'client@webotixs.com',
    password: 'client123',
    role: 'client'
  }
];

const projects = [
  {
    id: 'project-1',
    _id: 'project-1',
    name: 'Webotixs Website Revamp',
    clientId: 'client-1',
    status: 'In Progress',
    progress: 45,
    deadline: '2025-06-01'
  }
];

const tasks = [
  {
    id: 'task-1',
    _id: 'task-1',
    projectId: 'project-1',
    title: 'Content Discovery',
    order: 1,
    status: 'Completed',
    assignedTo: 'team-1'
  },
  {
    id: 'task-2',
    _id: 'task-2',
    projectId: 'project-1',
    title: 'UI/UX Wireframing',
    order: 2,
    status: 'In Progress',
    assignedTo: 'team-1'
  },
  {
    id: 'task-3',
    _id: 'task-3',
    projectId: 'project-1',
    title: 'Frontend Development',
    order: 3,
    status: 'Pending',
    assignedTo: 'team-1'
  }
];

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...rest } = user;
  return { ...rest, _id: rest.id };
};

const recalculateProjectProgress = (projectId) => {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;
  const projectTasks = tasks.filter((task) => task.projectId === projectId);
  if (projectTasks.length === 0) {
    project.progress = 0;
    return project;
  }
  const completedCount = projectTasks.filter((task) => task.status === 'Completed').length;
  project.progress = Math.round((completedCount / projectTasks.length) * 100);
  project.status = project.progress === 100 ? 'Completed' : project.status;
  return project;
};

const createClientWithWorkflow = ({ name, email, password, projectName, deadline }) => {
  const clientExists = users.find((user) => user.email === email);
  if (clientExists) {
    throw new Error('User already exists');
  }

  const clientId = randomUUID();
  const projectId = randomUUID();

  users.push({ id: clientId, _id: clientId, name, email, password, role: 'client' });

  const project = {
    id: projectId,
    _id: projectId,
    name: projectName,
    clientId,
    status: 'Onboarding',
    progress: 0,
    deadline
  };
  projects.push(project);

  const stages = [
    { label: 'Content', specialization: 'Content' },
    { label: 'UI/UX', specialization: 'UI/UX' },
    { label: 'Dev', specialization: 'Dev' },
    { label: 'SEO', specialization: 'SEO' }
  ];

  stages.forEach((stage, index) => {
    const assignee = users.find(
      (user) => user.role === 'team' && user.specialization === stage.specialization
    );

    const taskId = randomUUID();
    tasks.push({
      id: taskId,
      _id: taskId,
      projectId,
      title: `${stage.label} Implementation`,
      order: index + 1,
      status: 'Pending',
      assignedTo: assignee ? assignee.id : null
    });
  });

  recalculateProjectProgress(projectId);
  return project;
};

const findUserByEmailAndPassword = (email, password) => {
  if (!email || !password) return null;
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();
  return users.find((u) => 
    u.email.toLowerCase() === normalizedEmail && u.password === normalizedPassword
  );
};

const findUserById = (id) => users.find((u) => u.id === id);

const getAdminReports = () => {
  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => p.status === 'Completed').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;

  const projectStats = projects.map((project) => ({
    id: project.id,
    _id: project.id,
    name: project.name,
    status: project.status,
    progress: project.progress,
    client: sanitizeUser(users.find((u) => u.id === project.clientId))
  }));

  const teamPerformance = users
    .filter((u) => u.role === 'team')
    .map((teamMember) => ({
      ...sanitizeUser(teamMember),
      tasksAssigned: tasks.filter((t) => t.assignedTo === teamMember.id).length,
      tasksCompleted: tasks.filter(
        (t) => t.assignedTo === teamMember.id && t.status === 'Completed'
      ).length
    }));

  return {
    summary: { totalProjects, completedProjects, totalTasks, completedTasks },
    projectStats,
    teamPerformance
  };
};

const getAllUsers = () => users.map(sanitizeUser);

const getClientProject = (clientId) => {
  const project = projects.find((p) => p.clientId === clientId);
  if (!project) return null;
  const projectTasks = tasks
    .filter((task) => task.projectId === project.id)
    .sort((a, b) => a.order - b.order);
  return {
    project: { ...project, _id: project.id },
    tasks: projectTasks.map((task) => ({
      ...task,
      _id: task.id,
      projectName: project.name
    }))
  };
};

const getTasksForTeamMember = (teamMemberId) =>
  tasks
    .filter((task) => task.assignedTo === teamMemberId)
    .map((task) => ({
      ...task,
      _id: task.id,
      projectName: projects.find((p) => p.id === task.projectId)?.name || 'Untitled Project'
    }));

const getTaskById = (id) => tasks.find((task) => task.id === id);

const updateTaskStatus = (taskId, status) => {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return null;
  task.status = status;
  recalculateProjectProgress(task.projectId);
  return task;
};

module.exports = {
  users,
  projects,
  tasks,
  sanitizeUser,
  recalculateProjectProgress,
  createClientWithWorkflow,
  findUserByEmailAndPassword,
  findUserById,
  getAdminReports,
  getAllUsers,
  getClientProject,
  getTasksForTeamMember,
  getTaskById,
  updateTaskStatus
};
