const mysql = require('mysql');

module.exports = db = mysql.createConnection({
    host: 'localhost',
    user: 'nquest',
    password: 'root',
    database: 'nquest',
});
db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected Successful");
    }
});