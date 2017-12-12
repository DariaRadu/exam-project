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

event.saveLocation=(location, callback)=>{
    global.mongodb.collection('locations').insertOne(location, (err, jResult)=>{
        if (err){
            var jError = {"status":"error", "message":"ERROR -> location 001 -> Cannot save location"}
            console.log(jError);
            return callback(true, jError);
        }
        
        var jStatus = {"status":"ok", "message":"000 ->location saved"};
        console.log(jStatus);
        return callback(false, jStatus);
    })
}

module.exports = event;