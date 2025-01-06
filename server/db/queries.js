// queries.js
// Queries for the daily nonogram database

const client = require("./client");
require("dotenv").config();

const db = client.db(process.env.DATABASE_NAME_DAILY);
const collection = db.collection(process.env.COLLECTION_NAME_DAILY);

/*
    CORE QUERIES
*/

// reads the document that contains the date, rows, and cols
// throws error if fails to read
async function readDailyNonogram(date, rows, cols) {
  let result = null;
  try {
    result = await collection
      .find({ date: date, rows: rows, cols: cols }, { projection: { _id: 0 } })
      .toArray();
  } catch (error) {
    throw error;
  }

  return result;
}

// create and insert a new document
// throws error if fails to write
async function insertDailyNonogram(date, rowHints, colHints, seed) {
  try {
    const document = {
      date: date,
      rows: rowHints.length,
      cols: colHints.length,
      rowHints: rowHints,
      colHints: colHints,
      seed: seed,
    };

    const result = await collection.insertOne(document);
  } catch (error) {
    throw error;
  }
}

// update the problem for a date
async function updateDailyNonogram(date, rowHints, colHints) {
  try {
    const rows = rowHints.length;
    const cols = colHints.length;

    const filter = { date: date, rows: rows, cols: cols };
    const updateDocument = {
      date: date,
      rows: rows,
      cols: cols,
      rowHints: rowHints,
      colHints: colHints,
    };

    const result = await collection.updateOne(filter, updateDocument);
  } catch (error) {
    throw error;
  }
}

/*
    FUNCTIONAL QUERIES
*/

// checks whether or not there is already a nonogram present for the day
async function dailyNonogramIsPresent(date, rows, cols) {
  try {
    const result = await readDailyNonogram(date, rows, cols);

    return result.length > 0;
  } catch (error) {
    throw error;
  }
}

// get the daily 10x10 nonogram given the date
// throws error if fails; returns null if item was not found
async function getDailyNonogram10x10(date) {
  let result = null;
  try {
    console.log(`Getting Daily 10x10 for ${date}`);
    result = await readDailyNonogram(date, 10, 10);
    if (result.length == 0) {
      console.log(`No problem found for ${date}`);
      return null;
    }
    return result[0];
  } catch (error) {
    throw error;
  }
}

// set the daily 10x10 nonogram given the row and column hints
// returns true if the setting was successful or if there was already an entry present; false if fails
async function setDailyNonogram10x10(date, rowHints, colHints, seed) {
  try {
    // check if already present
    if (await dailyNonogramIsPresent(date, 10, 10)) {
      // await updateDailyNonogram(date, rowHints, colHints);
      console.log(`Nonogram already present at ${date}`);
      return true;
    }

    console.log(`About to insert for ${date}`);
    await insertDailyNonogram(date, rowHints, colHints, seed);
    return true;
  } catch (error) {
    console.log("Failure setting Daily Nonogram 10x10", error);
    return false;
  }
}

module.exports = {
  dailyNonogramIsPresent,
  getDailyNonogram10x10,
  setDailyNonogram10x10,
};
