var event = {};
const db = require('../../db/mysql.js');

event.save=(jEvent, callback)=>{
    let queryInsert=`INSERT INTO events (title, location, description, entrance_fee) VALUES ('${jEvent.title}', '${jEvent.location}', '${jEvent.description}', ${jEvent.entrance_fee});`;
    db.getConnection((err, connection)=> {
        if (err){
            callback(true,error);
            return;
        }
        connection.query(queryInsert, (error, results) =>{
            if (error){
                callback(true, error);
                connection.release();
                return;
              };
            callback(false, results);
            connection.release();

        })
})}

module.exports = event;