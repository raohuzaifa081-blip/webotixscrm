const { getClientProject } = require('../data');

exports.getMyProject = async (req, res) => {
  const result = getClientProject(req.user.id);
  if (!result) return res.status(404).json({ message: 'No project found for this account' });
  res.json(result);
};
