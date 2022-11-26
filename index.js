const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const productCollection = client.db("dreamBike").collection("allProducts");
    const usersCollection = client.db("dreamBike").collection("users");
    const bookingCollection = client.db("dreamBike").collection("booking");

    app.get("/allCategories", async (req, res) => {
      const query = {};
      const categories = await categoryCollection.find(query).toArray();
      res.send(categories);

      // temporary

      // app.get("/allCategoriesid", async (req, res) => {
      //   const filter = {};
      //   const options = { upsert: true };
      //   const updateDoc = {
      //     $set: {
      //       categoryID: 1,
      //     },
      //   };
      //   const result = await categoryCollection.updateMany(
      //     filter,
      //     updateDoc,
      //     options
      //   );

      //   res.send(result);
      // });

      app.post("/allProducts", async (req, res) => {
        const product = req.body;
        const result = await productCollection.insertOne(product);
        res.send(result);
      });

      app.get("/allProducts", async (req, res) => {
        let query = {};
        if (req.query.email) {
          query = {
            email: req.query.email,
          };
        }
        const product = await productCollection.find(query).toArray();
        res.send(product);
      });
      app.get("/allProducts", async (req, res) => {
        let query = {};
        if (req.query.email) {
          query = {
            categoryID: req.query.categoryID,
          };
        }
        const product = await productCollection.find(query).toArray();
        res.send(product);
      });

      app.get("/allProducts/:email", async (req, res) => {
        const email = req.params.email;
        const query = { email };
        const product = await productCollection.find(query).toArray();
        res.send(product);
      });

      app.post("/bookings", async (req, res) => {
        const booking = req.body;
        const result = await bookingCollection.insertOne(booking);
        res.send(result);
      });

      app.get("/bookings", async (req, res) => {
        const email = req.query.email;
        // const decodecEmail = req.decoded.email;
        // if (email !== decodecEmail) {
        //   return res.status(403).send({ message: "forbidden access" });
        // }
        const query = { email: email };
        const result = await bookingCollection.find(query).toArray();
        res.send(result);
      });

      app.post("/users", async (req, res) => {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.send(result);
      });

      app.get("/users", async (req, res) => {
        let query = {};
        if (req.query.role) {
          query = {
            role: req.query.role,
          };
        }
        const users = await usersCollection.find(query).toArray();
        res.send(users);
      });

      app.delete("/users/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const result = await usersCollection.deleteOne(filter);
        res.send(result);
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
