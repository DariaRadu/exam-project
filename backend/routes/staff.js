var express = require('express');
var router = express.Router();
const db = require('../db/mysql.js');

/* GET home page. */
router.get('/', (req, res, next)=> {
  db.getConnection((err, connection)=> {
    // Use the connection
    connection.query('SELECT * FROM staff', (error, results) =>{
      res.send(results);
      // And done with the connection.
      connection.release();
      // Handle error after the release.
      if (error) console.log(error);
   
      // Don't use the connection here, it has been returned to the pool.
    });
  });
});

router.get('/:id', (req, res)=> {
  let staffId = req.params.id;
  db.getConnection((err, connection)=> {
    // Use the connection
    connection.query('SELECT * FROM staff WHERE id='+staffId, (error, results) =>{
      res.send(results[0]);
      connection.release();
      if (error) console.log(error);
    });
  });
});



module.exports = router;