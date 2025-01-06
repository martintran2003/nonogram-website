// dailyNonogramControllers.js
// controllers fro daily nonogram functionality

const db = require("../db/queries");

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

    res.json(queryResult);
  } catch (error) {
    console.log("failed to get nonogram");
    console.log(error);
  }
}

module.exports = { getDailyNonogram };
