const express = require("express");
const router = express.Router();
const courses = require("../models/courses.models.js");

router.get("/courses", (req, res) => {
  res.json(courses);
});

module.exports = router;
