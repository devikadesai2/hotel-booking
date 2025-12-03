// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded may contain user info; keep id and role
    // depending on how you sign the token, adapt: here we assume token contains { id, email, role } or { user: { id, ... } }
    const userPayload = decoded.user || decoded; // support either structure
    req.user = { id: userPayload.id || userPayload._id, email: userPayload.email, role: userPayload.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
