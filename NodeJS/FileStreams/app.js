const fs = require("node:fs");

console.log("Started");
// Non Blocking
fs.readFile("Input.txt", (err, dataFromFile) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log(dataFromFile.toString());
  }
});

// Blocking
// const dataFromFile = fs.readFileSync("Input.txt");
// console.log(dataFromFile.toString());

console.log("Ended");
