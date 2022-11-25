const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Dream bike server is Running");
});
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.ouw6pvz.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb://localhost:27017";
// console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const categoryCollection = client
      .db("dreamBike")
      .collection("allCategorys");
    const productCollection = client.db("dreamBike").collection("AllProducts");
    const usersCollection = client.db("dreamBike").collection("users");

    app.get("/allCategories", async (req, res) => {
      const query = {};
      const categories = await categoryCollection.find(query).toArray();
      res.send(categories);

      app.post("/users", async (req, res) => {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.send(result);
      });

      app.get("/users", async (req, res) => {
        const query = {};
        const users = await usersCollection.find(query).toArray();
        res.send(users);
      });

      app.get("/users/admin/:email", async (req, res) => {
        const email = req.params.email;
        const query = { email };
        const user = await usersCollection.findOne(query);
        res.send({ isAdmin: user?.role === "admin" });
      });
      app.get("/users/seller/:email", async (req, res) => {
        const email = req.params.email;
        const query = { email };
        const user = await usersCollection.findOne(query);
        res.send({ isSeller: user?.role === "seller" });
      });
      app.get("/users/buyer/:email", async (req, res) => {
        const email = req.params.email;
        const query = { email };
        const user = await usersCollection.findOne(query);
        res.send({ isBuyer: user?.role === "buyer" });
      });
    });
  } catch (error) {
    console.log(error);
  }
}
run().catch((error) => {
  console.log(error);
});

app.listen(port, console.log(`server is running on port: ${port}`));
