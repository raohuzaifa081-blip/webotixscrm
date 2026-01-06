const { findUserById, sanitizeUser } = require('../data');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [, token] = authHeader.split(' ');
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  const user = findUserById(token);
  if (!user) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  req.user = sanitizeUser(user);
  next();
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role ${req.user.role} is not authorized` });
    }
    next();
  };
};

module.exports = { protect, authorize };
