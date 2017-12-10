// Load module
var mysql = require('mysql');
// Initialize pool
var pool      =    mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'events',
});  
  
module.exports = pool;