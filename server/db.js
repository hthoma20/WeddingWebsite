var mysql = require('mysql');

var con = mysql.createConnection({
  host: "wedding-db.czsecc6ywply.us-west-2.rds.amazonaws.com",
  user: "admin",
  password: "daylinharry"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});