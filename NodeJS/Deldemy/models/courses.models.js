const pool = require("../db/connection.js");

async function createCourse(course) {}

async function getAllCourses() {
  // connection & query
  const [rows] = await pool.query("SELECT * FROM courses ORDER BY id");

  // return resultset
  return rows;
}

async function getCourseById(id) {}

async function updateCourse(id, course) {}

async function deleteCourse(id) {}

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
