
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://admin:admin@past-forked-project-itvnf.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "past-forked-project";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  //console.log(db)
  db.collection('userList').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {entireUserList: result})
  })
})

app.get('*', (req, res) => {
  res.send('<h1>Invaild Page</h1>')
})

app.post('/newToDo', (req, res) => {
  db.collection('userList').save({item: req.body.item, thumbUp:false}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/userList', (req, res) => {
  db.collection('userList')
  .findOneAndUpdate({item: req.body.item}, {
    $set: {
      thumbUp:true
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.post('/userList2', (req, res) => {
  db.collection('userList2')
  .save({item: req.body.item, thumbUp:true}, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})
app.put('/userList2', (req, res) => {
  db.collection('userList2')
  .findOneAndUpdate({item: req.body.item, thumbUp:true}, {
    $set: {
      thumbUp:"completed"
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/userList', (req, res) => {
  db.collection('userList').findOneAndDelete({item: req.body.item, thumbUp:true}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})


//
// app.put('/messages2', (req, res) => {
//   db.collection('messages')
//   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
//     $set: {
//       thumbUp:req.body.thumbUp - 1
//     }
//   }, {
//     sort: {_id: -1},
//     upsert: true
//   }, (err, result) => {
//     if (err) return res.send(err)
//     res.send(result)
//   })
// })
//
// app.delete('/messages', (req, res) => {
//   db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
//     if (err) return res.send(500, err)
//     res.send('Message deleted!')
//   })
// })
