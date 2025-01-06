// dailyProblemRouter.js
// contains the routes for the daily nonogram part of the app

const { Router } = require("express");
const { getDailyNonogram } = require("../controllers/dailyNonogramControllers");

const dailyProblemRouter = Router();

// root; displays the default 10x10 daily
dailyProblemRouter.get("/", getDailyNonogram);

module.exports = dailyProblemRouter;
