const express = require("express");
const cors = require("cors");
const { generateRandomNonogram } = require("./controllers/nonogramControllers");
const dailyNonogramRouter = require("./routes/dailyProblemRouter");
const { populateWeek } = require("./db/populate");

require("dotenv").config();
process.on("uncaughtException", function (err) {
  console.error(err);
});

const app = express();

app.use(cors());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (
        !(origin == process.env.CLIENT_URL || origin == "http://localhost:5173")
      ) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
app.use(express.json());

app.get("/randomproblem?", generateRandomNonogram);

app.use("/daily", dailyNonogramRouter);

app.use("/", (req, res) => {
  res.json("hiii");
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port 8000.`);
});

const schedule = require("node-schedule");

// schedule a job that proactively populates a week of problems
const job = schedule.scheduleJob("0 0 * * *", async function () {
  console.log("Populating week");
  await populateWeek(10, 10);
});

module.exports = app;
