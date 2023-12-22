const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000; // Use process.env.PORT or default to 3000

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zkhcmhi.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {
    const taskCollection = client.db("taskManagementDB").collection("task");
    const contactCollection = client.db("taskManagementDB").collection("contact");

    

    app.get('/task', async (req, res) => {
      const result = await taskCollection.find().toArray();
      res.send(result);
    });

    app.get('/task/:id',async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await taskCollection.findOne(query)
      res.send(result)
    })



    app.patch('/task/complete/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: "Completed",
        }
      }
      const result = await taskCollection.updateOne(filter, updatedDoc);
      res.send(result);
    })


    app.post('/task', async (req, res) => {
      const item = req.body;
      const result = await taskCollection.insertOne(item);
      res.send(result);
    });

    app.get('/contact', async (req, res) => {
      const result = await contactCollection.find().toArray();
      res.send(result);
    });

    app.post('/contact',async (req, res) => {
      const item = req.body;
      const result = await contactCollection.insertOne(item);
      res.send(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Task manager')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




