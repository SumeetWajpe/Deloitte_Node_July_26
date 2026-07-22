const express = require("express");
const router = express.Router();
const courses = require("../models/courses.models.js");

router.get("/courses", (req, res) => {
  res.json(courses);
});

router.get("/coursedetails/:id", (req, res) => {
  let courseId = req.params.id;
  let theCourse = courses.find(c => c.id == courseId);
  // html
  res.render("coursedetails", { title: "Course Details", theCourse });
});

module.exports = router;
