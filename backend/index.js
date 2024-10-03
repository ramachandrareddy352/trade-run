const connectToMongo = require("./db");
const express = require("express");
var cors = require("cors");

connectToMongo();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.send("Hello World!");
});

// Available Routes
app.use("/api/airdrop", require("./routes/airdrop"));
// app.use("/api/userAirdrop", require("./routes/userAirdrop"));

app.listen(port, () => {
  console.log(`Trade-Run backend listening at http://127.0.0.1:${port}`);
});
