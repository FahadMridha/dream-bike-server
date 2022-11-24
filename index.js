const express = require("express");
const cors = require("cors");

const port = process.env.PORT || 5000;
const app = express();

app.get("/", (req, res) => {
  res.send("Dream bike server is Running");
});

app.listen(port, console.log(`server is running on port: ${port}`));
