const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // Check for token in header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attaches { userId: ... } to request
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
