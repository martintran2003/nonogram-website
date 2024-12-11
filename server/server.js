const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/randomproblem", (req, res) => {
  const seed = Date.now();
  // https://stackoverflow.com/questions/23450534/how-to-call-a-python-function-from-node-js
  const { spawn } = require("child_process");

  const prog = spawn("python3", [
    "./scripts/nonogramGenerator.py",
    "10",
    "10",
    String(seed),
  ]);

  prog.stdout.on("data", function (data) {
    const result = JSON.parse(JSON.stringify(data.toString()));

    res.json(result);
  });
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
