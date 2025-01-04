// populate.js
// Functions to populate the database with daily nonogram problems

const { setDailyNonogram10x10 } = require("./queries");

const generateNonogram = function (seed) {
  return new Promise(function (resolve, reject) {
    const { spawn } = require("child_process");
    const prog = spawn("python3", [
      "./scripts/nonogramGenerator.py",
      10,
      10,
      seed,
    ]);
    prog.stdout.on("data", function (data) {
      const result = JSON.parse(data);

      resolve(result);
    });
  });
};

async function populateDay(date) {
  // Get a seed
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  const seed = arr[0];

  console.log(`Populating ${date} with seed ${seed}`);
  const { rowHints, colHints } = await generateNonogram(seed);

  console.log(`Setting daily nonogram for ${date}`);
  const result = await setDailyNonogram10x10(date, rowHints, colHints, seed);

  if (result) {
    console.log(`Successfully inputted for ${date}`);
  }
}

async function populateWeek() {
  const date = new Date();

  for (let i = 0; i < 7; i++) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const currentDate = `${day}-${month}-${year}`;

    await populateDay(currentDate);

    date.setDate(date.getDate() + 1);
  }
}

module.exports = { populateDay, populateWeek };

populateWeek();
