const { findUserByEmailAndPassword, sanitizeUser } = require('../data');

exports.login = (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const user = findUserByEmailAndPassword(email, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const userData = { ...sanitizeUser(user), token: user.id };
    res.json(userData);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getMe = (req, res) => {
  res.json(sanitizeUser(req.user));
};
