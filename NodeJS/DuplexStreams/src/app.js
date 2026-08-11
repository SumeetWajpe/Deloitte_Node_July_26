const { createServer } = require("http");
const fs = require("fs");
const socket = require("socket.io");

const hostname = "127.0.0.1";
const port = 3000;

const readStream = fs.createReadStream("src/Index.html", "utf-8");
const server = createServer((req, res) => {
  readStream.pipe(res);
});

var io = socket(server);
io.sockets.on("connection", skt => {
  setInterval(() => {
    let dataToBeSent = new Date();
    skt.emit("msg_from_server_peer", dataToBeSent);
  }, 2000);

  skt.on("msg_from_client_peer", dataReceivedFromClient => {
    console.log(dataReceivedFromClient);
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at port - ${port}`);
});
