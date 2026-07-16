import fs from "fs";

const readStream = fs.createReadStream("src/Input.txt");
readStream.on("data", chunk => {
  console.log(
    ">>>>>>>>>>>>>>>>>>>>>>>>>>> CHUNK received >>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
  );
});

readStream.on("end", () => {
  console.log("Reading of file done.. ");
});
