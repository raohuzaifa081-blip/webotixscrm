const { findUserByEmailAndPassword, sanitizeUser } = require('../data');

exports.login = (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmailAndPassword(email, password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  res.json({ ...sanitizeUser(user), token: user.id });
};

exports.getMe = (req, res) => {
  res.json(sanitizeUser(req.user));
};
