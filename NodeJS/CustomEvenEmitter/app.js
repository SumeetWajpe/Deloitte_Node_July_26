const EventEmitter = require("events");

// publisher
function GetCount(maxIteration) {
  const evt = new EventEmitter();

  process.nextTick(() => {
    evt.emit("start");
    let cnt = 0;
    while (cnt < maxIteration) {
      evt.emit("data", cnt++);
    }
  });

  return evt;
}

//subscriber
console.log("Started..");
const e = GetCount(10);
e.on("start", () => {
  console.log("Iteration Started !");
});

e.on("data", count => {
  console.log(count);
});
console.log("Ended..");
