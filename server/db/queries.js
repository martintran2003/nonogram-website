const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = process.env.DATABASE_CONNECTION;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = client.db(process.env.DATABASE_NAME_DAILY);
const collection = db.collection(process.env.COLLECTION_NAME_DAILY);

async function getDailyNonogram10x10(date) {
  let result = null;
  try {
    // get the current date
    // const date = new Date();
    // let day = date.getDate();
    // let month = date.getMonth() + 1;
    // let year = date.getFullYear();
    // let currentDate = `${day}-${month}-${year}`;

    // console.log(`Getting Daily for ${currentDate}`);

    await client.connect();

    result = await collection
      .find({ date: date }, { projection: { _id: 0 } })
      .toArray();
  } finally {
    // await client.close();
  }

  return result;
}

async function setDailyNonogram10x10(date) {
  try {
    // Check if the current date is in already stored
    const document = getDailyNonogram10x10(date);

    // If the date is not stored, generate and add a new problem
    if (document.length == 0) {
    }
  } catch {
  } finally {
  }
}

// // run().catch(console.dir);
// getDailyNonogram10x10("1-1-2025").catch(console.dir);

module.exports = {
  getDailyNonogram10x10,
  setDailyNonogram10x10,
};
