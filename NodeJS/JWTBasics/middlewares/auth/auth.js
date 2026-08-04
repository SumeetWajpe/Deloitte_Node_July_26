const jwt = require("jsonwebtoken");
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"]; // Bearer token
  const token = authHeader?.split(" ")[1] || "";
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) return res.status(500).json({ err: "Invalid Token" });
      if (decodedToken) {
        console.log(decodedToken);
        next(); // proceed to next line of action meaning execute the handler (/users/profile)
      }
    });
  } else {
    return res.status(401).json({ err: "Token not found !" });
  }
}

module.exports = authMiddleware;
