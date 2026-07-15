// - add() - multiply()
// CommonJS Way
function Add(x, y) {
  return x + y;
}

function Multiply(x, y) {
  return x * y;
}

function Subtract(x, y) {
  return x - y;
}

module.exports.Addition = Add;
module.exports.Product = Multiply;
