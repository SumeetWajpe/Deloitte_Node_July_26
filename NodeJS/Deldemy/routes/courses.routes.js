const express = require("express");
const router = express.Router();
const courses = require("../models/courses.models.js");
const path = require("path");
const fs = require("fs");

router.get("/courses", (req, res) => {
  // Get data from DB
  res.json(courses);
});

router.get("/coursedetails/:id", (req, res) => {
  // Get data from DB
  let courseId = req.params.id;
  let theCourse = courses.find(c => c.id == courseId);
  // html
  res.render("coursedetails", { title: "Course Details", theCourse });
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
