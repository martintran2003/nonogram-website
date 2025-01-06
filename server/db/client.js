// client.js
// Set up client to connect to MongoDB for daily nonograms
// requires Node.js link to Database

require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.DATABASE_CONNECTION;
module.exports = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
