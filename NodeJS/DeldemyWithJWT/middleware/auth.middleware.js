const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Protects a route: requires a valid "Authorization: Bearer <token>" header.
// On success, attaches the decoded payload to req.user and calls next().
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "missing token" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "invalid or expired token" });
    }
    req.user = decoded; // { sub, email, iat, exp }
    next();
  });
}

module.exports = authMiddleware;
