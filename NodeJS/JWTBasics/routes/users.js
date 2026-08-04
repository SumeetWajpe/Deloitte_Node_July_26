var express = require("express");
var router = express.Router();
var authMiddleware = require("../middlewares/auth/auth.js");
/* GET users listing. */
router.get("/profile", authMiddleware, function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
