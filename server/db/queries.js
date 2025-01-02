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

// function that creates a new document
// throws error if fails to write
async function insertDailyNonogram(date, rowHints, colHints) {
  try {
    const document = {
      date: date,
      rows: rowHints.length,
      cols: colHints.length,
      rowHints: rowHints,
      colHints: colHints,
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

// function that checks whehter or not there is already a nonogram present for the day
async function dailyNonogramIsPresent(date, rows, cols) {
  try {
    const result = readDailyNonogram(date, rows, cols);
  } catch (error) {
    throw error;
  }
  return result.length > 0;
}

/*
    FUNCTIONAL QUERIES
*/

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

async function setDailyNonogram10x10(date, rowHints, colHints) {
  try {
    const rows = rowHints.length;
    const cols = colHints.length;

    if (dailyNonogramIsPresent(date, rows, cols)) {
      await updateDailyNonogram(date, rowHints, colHints);
    } else {
      await insertDailyNonogram(date, rowHints, colHints);
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  dailyNonogramIsPresent,
  getDailyNonogram10x10,
  setDailyNonogram10x10,
};
