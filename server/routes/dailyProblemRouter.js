const { Router } = require("express");
const { getDailyNonogram } = require("../controllers/nonogramControllers");

const dailyProblemRouter = Router();

dailyProblemRouter.get("/", getDailyNonogram);

module.exports = dailyProblemRouter;
