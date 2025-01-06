// nonogramControllers.js
// controllers for nonograms functionality

// generate a random nonogram using the provided query values for row and col
function generateRandomNonogram(req, res) {
  let rows, cols;
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

  const seed = Date.now();
  // https://stackoverflow.com/questions/23450534/how-to-call-a-python-function-from-node-js
  const { spawn } = require("child_process");

  const prog = spawn("python3", [
    "./scripts/nonogramGenerator.py",
    rows,
    cols,
    seed,
  ]);

  prog.stdout.on("data", function (data) {
    const result = JSON.parse(data);

    res.json(result);
  });
}

module.exports = { generateRandomNonogram };
