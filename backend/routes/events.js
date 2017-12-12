var express = require('express');
var router = express.Router();
const db = require('../db/mysql.js');
//const formidable = require('express-formidable');

//router.use(formidable());

let eventController = require(__dirname+'/controllers/event.js');

/* GET home page. */
router.get('/', (req, res, next)=> {
  db.getConnection((err, connection)=> {
    // Use the connection
    connection.query('SELECT * FROM events', (error, results) =>{
      res.send(results);
      // And done with the connection.
      connection.release();
      // Handle error after the release.
      if (error) console.log(error);
   
      // Don't use the connection here, it has been returned to the pool.
    });
  });
});

router.get('/get/:id', (req, res)=> {
  let eventId = req.params.id;
  db.getConnection((err, connection)=> {
    // Use the connection
    connection.query('SELECT * FROM events WHERE id='+eventId, (error, results) =>{
      res.send(results[0]);
      connection.release();
      if (error) console.log(error);
    });
  });
});


router.post('/add', (req, res)=>{
  //console.log("yes");
  //res.send(req.body);
  let eventTitle = req.body.eventTitle;
  let eventDate = req.body.eventDate;
  let eventPrice = req.body.eventPrice;
  let eventDescription = req.body.eventDescription;
  let eventLocation = req.body.eventLocation;
  let eventImage = 25164;

  var jEvent={
    "title":eventTitle,
    "date":eventDate,
    "entrance_fee":eventPrice,
    "description":eventDescription,
    "image_src":eventImage,
    "location":eventLocation
  }
  
  eventController.save(jEvent, (err, result)=>{
    if (err){
      res.send(result);
      return;
    }
    res.send(result);
  })
})

router.post('/add/location', (req,res)=>{
  var location = req.body;
  //we first check if the location already exists
  global.mongodb.collection('locations').find({"name":location.name}).count()
  .then((count) => {
    //count returns a promise, which gives the total amount of rows
    var checkIfLocationExists=count;
    if (checkIfLocationExists==0){
      //if the location doesn't exist, we save it
      eventController.saveLocation(location, (err, result)=>{
        if (err){
          console.log(result.message);
          return;
        }
      })

      //we send back the location name to be added in the Events table with the rest
      res.send(location.name);
    }
  });

})

module.exports = router;
