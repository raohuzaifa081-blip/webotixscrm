const {
  createClientWithWorkflow,
  getAdminReports,
  getAllUsers
} = require('../data');

exports.createClientWorkflow = async (req, res) => {
  try {
    const project = createClientWithWorkflow(req.body);
    res.status(201).json({
      message: 'Client and workflow created successfully',
      project
    });
  } catch (error) {
    const status = error.message === 'User already exists' ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

exports.getReports = async (req, res) => {
  const reports = getAdminReports();
  res.json(reports);
};

exports.getAllUsers = async (req, res) => {
  res.json(getAllUsers());
};
