const express = require("express");
const router = express.Router();

var products = [
  { id: 1, title: "MacBookPro" },
  { id: 2, title: "LED TV" },
];

router.get("/products", (req, res) => {
  res.json(products);
});

router.get("/gethtml", (req, res) => {
  // render
  res.render("index", {
    title: "Using Pug !",
    heading: "This is displayed using Pug  !",
  });
});

router.get("/productdetails/:pid", (req, res) => {
  const pid = req.params.pid;
  let theProduct = products.find(p => p.id == pid);
  res.json(theProduct);
});

router.post("/newproduct", (req, res) => {
  console.log(req.body);
  let newproduct = req.body;
  products.push(newproduct);
  console.log("Adding a new Product !");
  res.send("New product added successfully !");
});

module.exports = router;
