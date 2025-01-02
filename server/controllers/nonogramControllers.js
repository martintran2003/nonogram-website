const { query } = require("express");
const db = require("../db/queries");

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
    String(seed),
  ]);

  prog.stdout.on("data", function (data) {
    const result = JSON.parse(JSON.stringify(data.toString()));

    res.json(result);
  });
}

async function getDailyNonogram(req, res) {
  // get the result from the query for the daily nonogram
  try {
    const date = new Date();

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const currentDate = `${day}-${month}-${year}`;

    const queryResult = await db
      .getDailyNonogram10x10(currentDate)
      .catch(console.dir);

    console.log(queryResult);
    res.json(queryResult);
  } catch (error) {
    console.log("failed to get nonogram");
    console.log(error);
  }
}

module.exports = { generateRandomNonogram, getDailyNonogram };
