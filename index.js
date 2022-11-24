const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const port = process.env.PORT || 5000;
const app = express();

app.get("/", (req, res) => {
  res.send("Dream bike server is Running");
});

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const categoryCollection = client
      .db("dreamBike")
      .collection("AllCategorys");
    const productCollection = client.db("dreamBike").collection("AllProducts");
  } catch (error) {
    console.log(error);
  }
}
run().catch((error) => {
  console.log(error);
});

app.listen(port, console.log(`server is running on port: ${port}`));
