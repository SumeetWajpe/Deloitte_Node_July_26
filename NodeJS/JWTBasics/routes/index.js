require("dotenv").config();
var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

// constants
const JWT_SECRET = process.env.JWT_SECRET || "DevJWTSecret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const SALT_ROUNDS = 10;
const users = [];
let id = 1;
/* GET home page. */
router.post("/login", async function (req, res, next) {
  let { email, password } = req.body;
  console.log(password);

  if (!email || !password) {
    return res.status(400).json({ error: "Email and Password are required !" });
  }

  // hash the password
  const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = { id: id++, email, hashPassword };
  users.push(user);
  console.log(user);

  let payload = { email, lastLogin: "Tue 4th Aug" };
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }, (err, token) => {
    if (err) console.log(err);
    else return res.json({ token });
  });
});

router.post("/verify", function (req, res) {
  const authHeader = req.headers.authorization; // Bearer token
  const token = authHeader?.split(" ")[1] || "";
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) return res.status(500).json({ err: "Invalid Token" });
      if (decodedToken) {
        console.log(decodedToken);
        return res.json({ msg: "User authenticated successfully !" });
      }
    });
  } else {
    return res.status(401).json({ err: "Token not found !" });
  }
});

module.exports = router;
