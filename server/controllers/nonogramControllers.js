// nonogramControllers.js
// controllers for nonograms functionality

const { generateBoard } = require("../scripts/nonogramGenerator");

// generate a random nonogram using the provided query values for row and col
function generateRandomNonogram(req, res) {
  let rows, cols, seed;
  if (req.query.hasOwnProperty("rows")) {
    rows = req.query.rows;
  } else {
    rows = "10";
  }

  if (req.query.hasOwnProperty("cols")) {
    cols = req.query.cols;
  } else {
    cols = "10";
  }
  if (req.query.hasOwnProperty("seed")) {
    seed = req.query.seed;
  } else {
    seed = Date.now();
  }

  console.log(
    `Attempting to generate ${rows}x${cols} nonogram for seed ${seed}`
  );
  // // https://stackoverflow.com/questions/23450534/how-to-call-a-python-function-from-node-js
  // const { spawn } = require("child_process");

  // const prog = spawn("python3", [
  //   "./scripts/nonogramGenerator.py",
  //   rows,
  //   cols,
  //   seed,
  // ]);

  // prog.stdout.on("data", function (data) {
  //   const result = JSON.parse(data);

  //   res.json(result);
  // });

  res.json(generateBoard(rows, cols, seed));
}

module.exports = { generateRandomNonogram };
