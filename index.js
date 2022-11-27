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
    const advertiseCollection = client.db("dreamBike").collection("advertise");

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

      //post api create for allProducts
      app.post("/allProducts", async (req, res) => {
        const product = req.body;
        const result = await productCollection.insertOne(product);
        res.send(result);
      });

      // app.get("/allProducts", async (req, res) => {
      //   let query = {};
      //   if (req.query.email) {
      //     query = {
      //       email: req.query.email,
      //     };
      //   }
      //   const product = await productCollection.find(query).toArray();
      //   res.send(product);
      // });

      //get api for allProducts
      app.get("/allProducts", async (req, res) => {
        let query = {};
        if (req.query.categoryID) {
          query = {
            categoryID: req.query.categoryID,
          };
        }
        const product = await productCollection.find(query).toArray();
        res.send(product);
      });

      app.delete("/allProducts/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const result = await productCollection.deleteOne(filter);
        res.send(result);
      });

      app.get("/allProducts/:email", async (req, res) => {
        const email = req.params.email;
        const query = { email };
        const product = await productCollection.find(query).toArray();
        res.send(product);
      });

      //post api create for booking
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

      //post api create for advertised

      app.post("/advertise", async (req, res) => {
        const advertise = req.body;
        const result = await advertiseCollection.insertOne(advertise);
        res.send(result);
      });

      //get api create for advertised

      app.get("/advertise", async (req, res) => {
        const query = {};
        const result = await advertiseCollection.find(query).toArray();
        res.send(result);
      });

      //post api create for user
      app.post("/users", async (req, res) => {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.send(result);
      });
      //get api for all user
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

      app.put("/users/seller/:id", async (req, res) => {
        const id = req.params.id;
        const status = req.body.status;
        const options = { upsert: true };
        const filter = { _id: ObjectId(id) };
        const updateDoc = {
          $set: {
            status: status,
          },
        };

        const result = await usersCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        res.send(result);
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
