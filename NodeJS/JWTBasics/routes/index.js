var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
/* GET home page. */
router.post("/login", function (req, res, next) {
  console.log(req.body);
  let userInfo = req.body;
  let payload = { name: userInfo.name, lastLogin: "Tue 4th Aug" };
  jwt.sign(payload, "MySecretKey", { expiresIn: "2 Days" }, (err, token) => {
    if (err) console.log(err);
    else return res.json({ token });
  });
});

router.post("/verify", function (req, res) {
  const authHeader = req.headers.authorization; // Bearer token
  const token = authHeader?.split(" ")[1] || "";
  if (token) {
    jwt.verify(token, "MySecretKey", (err, decodedToken) => {
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
