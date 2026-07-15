// - add() - multiply()
// function Add(x, y) {
//   return x + y;
// }

// function Multiply(x, y) {
//   return x * y;
// }

// function Subtract(x, y) {
//   return x - y;
// }
// // CommonJS Way
// module.exports.Addition = Add;
// module.exports.Product = Multiply;

// ES6
export default function Add(x, y) {
  return x + y;
}

export function Multiply(x, y) {
  return x * y;
}

function Subtract(x, y) {
  return x - y;
}
