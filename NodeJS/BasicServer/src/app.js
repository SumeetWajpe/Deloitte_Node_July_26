// server.mjs
import { createServer } from "node:http";
import fs from "node:fs";

const server = createServer((req, res) => {
  console.log(req.url);
  if (req.url == "/") {
    fs.readFile("src/Index.html", (err, data) => {
      if (err) {
        console.log(err.message);
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  } else if (req.url == "/styles.css") {
    fs.readFile("src/styles.css", (err, data) => {
      if (err) {
        console.log(err.message);
      } else {
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(data);
      }
    });
  } else if (req.url == "/script.js") {
    const readableStream = fs.createReadStream("src/script.js", {
      encoding: "utf-8",
    });
    res.writeHead(200, { "Content-Type": "text/javascript" });
    readableStream.on("error", err => {
      console.log(err.message);
    });
    readableStream.pipe(res);
  }
});

// starts a simple http server locally on port 3000
server.listen(3000, "127.0.0.1", () => {
  console.log("Listening on 127.0.0.1:3000");
});

// run with `node server.mjs`
