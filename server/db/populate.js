// populate.js
// Functions to populate the database with daily nonogram problems

const crypto = require("crypto");

const { setDailyNonogram10x10 } = require("./queries");
const { generateBoard } = require("../scripts/nonogramGenerator");

// populate a given day with nonograms with random seed if not present
async function populateDay(date, rows, cols) {
  // Generate random seed
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  const seed = arr[0];

  console.log(`Populating ${date} with seed ${seed}`);
  const { rowHints, colHints } = generateBoard(rows, cols, seed);

  console.log(`Setting daily nonogram for ${date}`);
  const result = await setDailyNonogram10x10(date, rowHints, colHints, seed);

  if (result) {
    console.log(`Nonogram for ${date} is successfully populated`);
  }
}

// populate the week starting at the current day
async function populateWeek(rows, cols) {
  const date = new Date(); // get current date

  // iterate through each day of the week to populate
  for (let i = 0; i < 7; i++) {
    // get date
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const currentDate = `${day}-${month}-${year}`;

    // populate day
    await populateDay(currentDate, rows, cols);

    // iterate to next day
    date.setDate(date.getDate() + 1);
  }
}


module.exports = { populateDay, populateWeek };

(async () => {
  await populateWeek(10, 10);
})();
 