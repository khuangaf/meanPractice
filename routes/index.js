var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index.html', { title: 'Express' });
  // res.sendFile( '//localhost:3000/views/index.html');
  res.render('index', { title: 'ejs' });
});

router.get('/a', function(req, res, next) {
  // res.render('index.html', { title: 'Express' });
  // res.sendFile( '//localhost:3000/views/index.html');
  res.render('about', { title: 'ejs' });
});

router.post('/store', function(req, res){
  console.log("you are here");
  console.log(req);
  console.log(req.body);
  res.send('Successful');
});


router.get('/login', function(req, res){
  res.render('login');
});



router.post('/addUser', function(req, res){
  console.log(req.body);
  
  
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/meanPractice';
  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the Server', err);
  } else {
    // We are connected
    console.log('Connection established to', url);
    var collection = db.collection('users');
    var user = {name: req.body.name, id: new Date()};
    collection.insert([user], function(err, result){
      if(err){
        console.log("cannot insert");
      }
      else{
        console.log("added");
      }
    });
    res.render('login');
  }
  });
});

router.get('/api', function(req, res,next){
  console.log('You are in student route');
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/meanPractice';
  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the Server', err);
  } else {
    // We are connected
    console.log('Connection established to', url);
 
    // Get the documents collection
    var collection = db.collection('students');
    // collection.update({"student": "Dale Cooper"},{"$set": {"money": 12345, "student": "Steeve"}});
    // Find all students

    collection.find({}).toArray(function (err, result) {
      if (err) {
        
        res.send(err);
      } else if (result.length) {
        
        // res.render('studentlist',{ studentlist : result });
        console.log('route', result);
        // return result;
        res.json(result);
      } else {
        console.log("no document");
        res.send('No documents found');
      }
      //Close connection
      db.close();
      return;
    });
  }
  });
});
router.get('/thelist', function(req, res, next){
  console.log('ab');
  // res.render('about', { title: 'ejs' });
  
  // Get a Mongo client to work with the Mongo server
  var MongoClient = mongodb.MongoClient;
 
  // Define where the MongoDB server is
  var url = 'mongodb://localhost:27017/meanPractice';
 
  // Connect to the server
  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the Server', err);
  } else {
    // We are connected
    console.log('Connection established to', url);
 
    // Get the documents collection
    var collection = db.collection('students');
    collection.update({"student": "Dale Cooper"},{"$set": {"money": 12345, "student": "Steeve"}});
    // Find all students
    collection.find({}).toArray(function (err, result) {
      if (err) {
        
        res.send(err);
      } else if (result.length) {
        
        res.render('studentlist',{ studentlist : result });
        // res.render('index', { studentlist: 'ejs' });
      } else {
        console.log("no document");
        res.send('No documents found');
      }
      //Close connection
      db.close();
    });
  }
  });
});
module.exports = router;