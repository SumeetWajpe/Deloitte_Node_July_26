const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersModel = require("../models/users.models.js");
const authMiddleware = require("../middleware/auth.middleware.js");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const SALT_ROUNDS = 10;

// POST /auth/register — create a new user with a bcrypt-hashed password
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "name, email and password are required" });
    }

    const existing = await usersModel.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "user already exists" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await usersModel.createUser({ name, email, passwordHash });

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "failed to register user" });
  }
});

// POST /auth/login — verify credentials and sign a JWT
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = await usersModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "failed to log in" });
  }
});

// GET /auth/me — protected route, returns the logged-in user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await usersModel.getUserById(req.user.sub);
    if (!user) return res.status(404).json({ error: "user not found" });
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "failed to fetch user" });
  }
});

module.exports = router;
