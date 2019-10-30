const mysql = require('mysql');
const credentials= require('./credentials');

const connectionInfo = {
  host: credentials.db_host,
  user: credentials.db_username,
  password: credentials.db_password,
  database: credentials.db_name
};

module.exports.query= function(query){
	return new Promise((resolve, reject) => {
		let con= mysql.createConnection(connectionInfo);
		con.connect(function(err) {
			if (err){
				reject(err);
			}
			
			con.query(query, function (err, result) {
				if (err){
					reject(err);
				}

				resolve(result);
			});
		});
	});
}