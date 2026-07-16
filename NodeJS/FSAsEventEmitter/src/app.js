import fs from "fs";

const readStream = fs.createReadStream("src/Input.txt");
const writeStream = fs.createWriteStream("src/Output.txt");
// let dataToBeWritten = "";
// readStream.on("data", chunk => {
//   console.log(
//     ">>>>>>>>>>>>>>>>>>>>>>>>>>> CHUNK received >>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
//   );
//   dataToBeWritten += chunk;
// });

// readStream.on("end", () => {
//   console.log("Reading of file done.. ");
//   writeStream.write(dataToBeWritten);
// });

// OR
readStream.pipe(writeStream);
