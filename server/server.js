const express = require("express");
const cors = require("cors");
const {
  generateRandomNonogram,
  getDailyNonogram,
} = require("./controllers/nonogramControllers");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/randomproblem?", generateRandomNonogram);

app.get("/dailyproblem", getDailyNonogram);

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
