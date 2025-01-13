const express = require("express");
const cors = require("cors");
const { generateRandomNonogram } = require("./controllers/nonogramControllers");
const dailyNonogramRouter = require("./routes/dailyProblemRouter");
const { populateWeek } = require("./db/populate");

process.on("uncaughtException", function (err) {
  console.error(err);
});

const app = express();

const allowedOrigins = [
  "nonogram-website-ecu0tfe5k-martintran2003s-projects.vercel.app",
];
app.use(cors());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
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

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});

const schedule = require("node-schedule");

// schedule a job that proactively populates a week of problems
const job = schedule.scheduleJob("0 0 * * *", async function () {
  console.log("Populating week");
  await populateWeek(10, 10);
});

module.exports = app;
