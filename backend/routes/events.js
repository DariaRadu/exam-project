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
  let eventImage = 25164;

  var jEvent={
    "title":eventTitle,
    "date":eventDate,
    "entrance_fee":eventPrice,
    "description":eventDescription,
    "image_src":eventImage,
    "location":'KEA'
  }
  
  eventController.save(jEvent, (err, result)=>{
    if (err){
      res.send(result);
      return;
    }
    res.send(result);
  })
})

module.exports = router;
