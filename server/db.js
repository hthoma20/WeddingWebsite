var mysql = require('mysql');

var con = mysql.createConnection({
  host: "wedding-db.czsecc6ywply.us-west-2.rds.amazonaws.com",
  user: "admin",
  password: "daylinharry"
});

module.exports.query= function(query){
	return new Promise(resolve, reject => {
		con.connect(function(err) {
			if (err){
				reject(err);
			}
			
			console.log("Connected!");

			con.query(query, function (err, result) {
				if (err){
					reject(err);
				}

				resolve(result);
			});
		});
	});
}