const express = require("express");
const cors = require("cors");
const { generateRandomNonogram } = require("./controllers/nonogramControllers");
const dailyNonogramRouter = require("./routes/dailyProblemRouter");
const { populateWeek } = require("./db/populate");

process.on("uncaughtException", function (err) {
  console.error(err);
});

const app = express();

app.use(cors());
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
