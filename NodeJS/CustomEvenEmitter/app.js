const EventEmitter = require("events");

// publisher
function GetCount(maxIteration) {
  const evt = new EventEmitter();

  process.nextTick(() => {
    evt.emit("start");
    let cnt = 0;
    while (cnt < maxIteration) {
    //   if (cnt == 5) {
    //     evt.emit("error", cnt);
    //     break;
    //   }

      evt.emit("data", cnt++);
      // cnt == maxIteration -> emit end
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

e.on("error", cnt => {
  console.log("Iteration eneded with error : " + cnt);
});
console.log("Ended..");

// error ->
// end ->
