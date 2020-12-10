const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.eqzz0.mongodb.net:27017,cluster0-shard-00-01.eqzz0.mongodb.net:27017,cluster0-shard-00-02.eqzz0.mongodb.net:27017/${process.DB_NAME}?ssl=true&replicaSet=atlas-3xux2s-shard-0&authSource=admin&retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000


app.get('/', (req, res) => {
  res.send('Hello World!')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("volunteerNetwork").collection("volunteerItems");
  const registerInfoCollection = client.db("volunteerNetwork").collection("RegistrationInfo");
  
    app.post('/addProduct', (req, res) => {
      const product = req.body;
      productsCollection.insertOne(product)
        .then(result => {
          res.send(result.insertedCount)
        })
    })

    app.get('/products', (req, res) => {
      productsCollection.find({})
      .toArray( (err, documents) => {
        res.send(documents);
      })
    })

    app.get('/product/:_id', (req, res) => {
      productsCollection.find({_id: ObjectId(req.params._id)})
      .toArray( (err, documents) => {
        res.send(documents[0]);
      })
    })

    app.post('/addRegisterInfo', (req, res) => {
      const registerInfo = req.body;
      registerInfoCollection.insertOne(registerInfo)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    })

    app.get('/RegisterInfo', (req, res) => {
      registerInfoCollection.find({email: req.query.email})
      .toArray((err, documents) => {
          res.send(documents);
      })
    })

    app.get('/VolunteerRegisterList', (req, res) => {
      registerInfoCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
    })

    app.delete('/RegisterInfoDelete/:_id', (req, res) => {
      registerInfoCollection.deleteOne({_id: req.params._id})
      .then( result => {
        console.log(result);
      })
    })

});



app.listen(process.env.PORT || port)