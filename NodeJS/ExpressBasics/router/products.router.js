const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  var products = [
    { id: 1, title: "MacBookPro" },
    { id: 2, title: "LED TV" },
  ];
  res.json(products);
});

router.post("/newproduct", (req, res) => {
  console.log("Adding a new Product !");
  res.send("New product added successfully !");
});

module.exports = router;
