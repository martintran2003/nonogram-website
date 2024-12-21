const express = require("express");
const cors = require("cors");
const { generateRandomNonogram } = require("./controllers/nonogramControllers");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/randomproblem?", generateRandomNonogram);

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
