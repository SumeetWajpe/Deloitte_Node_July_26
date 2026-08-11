const pool = require("../db/connection.js");

async function createCourse(course) {}

async function getAllCourses() {
  // connection & query
  const [rows] = await pool.query("SELECT * FROM courses ORDER BY id");

  // return resultset
  return rows;
}

async function getCourseById(id) {
  const [rows] = await pool.query("SELECT * FROM courses WHERE id = ?", [id]);
  return rows[0];
}

async function updateCourse(id, course) {}

async function deleteCourse(id) {
  const [result] = await pool.query(
    "DELETE FROM courses WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
}

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
