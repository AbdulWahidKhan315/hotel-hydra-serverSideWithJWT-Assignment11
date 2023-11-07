const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-q1etzcd-shard-00-00.oiitlmi.mongodb.net:27017,ac-q1etzcd-shard-00-01.oiitlmi.mongodb.net:27017,ac-q1etzcd-shard-00-02.oiitlmi.mongodb.net:27017/?ssl=true&replicaSet=atlas-q3xr8u-shard-0&authSource=admin&retryWrites=true&w=majority`;
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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const roomsCollection = client.db('hotelHydra').collection('rooms');
        const bookingCollection = client.db('hotelHydra').collection('bookings');


        app.get('/api/rooms',async(req,res)=>{
            const cursor = roomsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/api/rooms_details/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id : new ObjectId(id)};
            const result = await roomsCollection.findOne(query);
            res.send(result)
        })

        app.get('/api/bookings',async(req,res)=>{
            let query = {};
            if(req.query?.email){
                query = {email: req.query?.email}
            }
            const result = await bookingCollection.find(query).toArray();
            res.send(result)
        })

        app.post('/api/bookings',async(req,res)=>{
            const bookings = req.body;
            const doc = {
                roomName:bookings.roomName,
                phoneNumber:bookings.phoneNumber,
                price:bookings.price,
                dateIn:bookings.dateIn,
                dateOut:bookings.dateOut,
                email:bookings.email,
                img1:bookings.img1,
            }
            const result = await bookingCollection.insertOne(doc);
            res.send(result)
        })

        app.delete('/api/bookings/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await bookingCollection.deleteOne(query);
            res.send(result);
        })



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
    res.send('Hotel Hydra server is running....')
})

app.listen(port, () => {
    console.log(`Hotel Hydra server is runnig on port: ${port}`);
})

//hotelHydra
//bslblUgE3P6Pl8HF