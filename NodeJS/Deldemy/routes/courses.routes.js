const express = require("express");
const router = express.Router();
const coursesModel = require("../models/courses.models.js");
const path = require("path");
const fs = require("fs");

router.get("/courses", async (req, res) => {
  // Get data from DB
  try {
    const courses = await coursesModel.getAllCourses();
    res.json(courses);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

router.get("/coursedetails/:id", async (req, res) => {
  try {
    let courseId = +req.params.id;
    console.log(courseId);
    // Get data from DB
    const theCourse = await coursesModel.getCourseById(courseId);
    console.log(theCourse);
    if (!theCourse) return res.status(404).send("Course not found !");

    // html
    res.render("coursedetails", { title: "Course Details", theCourse });
  } catch (error) {}
});

router.post("/newcourse", (req, res) => {
  // read the json from req.body
  // insert data in DB
});

router.get("/video", (req, res) => {
  // access to video
  const videoPath = path.resolve(path.dirname(".") + "/videos", "bunny.mp4");
  const videoSize = fs.statSync(videoPath).size; // 5.3 MB
  const CHUNK_SIZE = 10 ** 6; // 1MB
  console.log(videoSize);

  // range
  const range = req.headers.range;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  const contentLength = end - start + 1;

  const headers = {
    "Content-Type": "video/mp4",
    "content-range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
  };

  res.writeHead(206, headers);
  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
});

module.exports = router;
