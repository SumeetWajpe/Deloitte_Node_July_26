const express = require("express");
const productsRouter = require("./router/products.router.js");
const app = express();
const port = 3000;

// middlewares
app.use(express.static("src/static"));
app.use("/products", productsRouter);

// register an endpoint for GEt verb with path as /
app.get("/", (req, res) => {
  // res.send("<h1>Hello World!</h1>");
  res.sendFile("Index.html", { root: __dirname });
});

// app.get("/script.js", (req, res) => {
//   // res.send("<h1>Hello World!</h1>");
//   res.sendFile("Index.html", { root: __dirname });
// });
// app.get("/styles.css", (req, res) => {
//   // res.send("<h1>Hello World!</h1>");
//   res.sendFile("Index.html", { root: __dirname });
// });

app.get("/products", (req, res) => {
  var products = [
    { id: 1, title: "MacBookPro" },
    { id: 2, title: "LED TV" },
  ];
  res.json(products);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
