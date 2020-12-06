const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pnnmm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
const port = 3001

app.get('/', (req, res) =>{
    res.send('working')
} )



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventsCollection = client.db("volanteer-server").collection("events");
  const userEventsCollection = client.db("volanteer-server").collection("user-event");
  const adminEventsCollection = client.db("volanteer-server").collection("admin-event");
 
  console.log("db connected")
//   app.post("/addEvents", (req, res) =>{
//     const event = req.body;
//     console.log(event)
//     eventsCollection.insertMany(event)
//     .then(result =>{
//       console.log(result.insertedCount);
//       res.send(result.insertedCount)
    
//     })
  
//   })
 

app.post('/adminLogin', (req,res)=>{ // ----------------------------------- Admin login--------
    const data = req.body;
    adminEventsCollection.find({email: data.email, password: data.password})
    .toArray((err, documents) => {
        if(documents.length > 0){
            res.send(true)
        }else{
            res.send(false)
        }
    })
})


app.post('/addNewEventItem', (req, res) => { // ----------------------------------- admin can add new event item
    const data = req.body;
    let same = 0;
    console.log(data);
    collection.find({ title: data.title })
        .toArray((err, documents) => {
            console.log(documents.length)
            if (documents.length > 0) {
                res.send(false)
            } else {
                collection.insertOne(data)
                    .then(result => {
                        if (result) {
                            res.send(result.insertedCount > 0)
                        }
                    })
            }
        })
})
  

app.get('/allEvents', (req, res) => { // ----------------------------------- admin can see all event
    eventsCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
})


app.get('/search/:id', (req,res)=>{ // ----------------------------------- anyone can search for a particular event
    eventsCollection.find({_id : ObjectId(req.params.id)})
    .toArray((err, documents)=>{
        res.send(documents[0])
    })
})

//------------ api for user (total 3) -------------

app.post('/saveEvent' , (req,res)=>{ // ----------------------------------- user can save his event
    const eventItem = req.body;
    console.log(eventItem)
    userEventsCollection.find({email: eventItem.email, eventTitle: eventItem.eventTitle})
    .toArray((err , documents)=>{
        console.log(documents.length)
        if(documents.length > 0){
            res.send(false)
        }else{
            userEventsCollection.insertOne(eventItem)
            .then(result=>{
                res.send(result.insertedCount > 0)
            })
        }
    })
})

app.get('/userEventList/:email', (req,res)=>{ // ----------------------------------- user can see his registered events only
    const user_email = req.params.email;
    console.log(user_email)
    userEventsCollection.find({email: user_email})
    .toArray((err, documents)=>{
            res.send(documents)
    })
})




app.delete('/deleteMyEvent/:id', (req, res) => { // ------------------------------- user can delete his event
    console.log(req.params.id)
    userEventsCollection.find({ _id: ObjectId(req.params.id) })
        .toArray((err, documents) => {
            if (documents.length > 0) {
                userEventsCollection.deleteOne({ _id: ObjectId(req.params.id) })
                    .then(result => {
                        res.send(result.deletedCount > 0)
                    })
            }
        })
})
});


app.listen( process.env.PORT || port)