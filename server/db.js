const sqlite3 = require('sqlite3');

const log= require('./log').logger;


module.exports.query= function(query){
	
	//preprosses the query
	query= query.replace(/false|FALSE/g, "0");
	query= query.replace(/true|TRUE/g, "1");
	
	return new Promise( (resolve, reject) => {
		
		let db= new sqlite3.Database('./server/Wedding.db', sqlite3.OPEN_READWRITE, (err) => {
			if(err){
				log.error(err);
				reject(err);
				return;
			}
		});
		
		db.all(query, [], (err, rows) => {
			
			if(err){
				console.log(err);
				return;
			}
			
			resolve(rows);
		});
		
		db.close((err) => {
			if (err) {
				log.error(err.message);
				reject(err);
				return;
			}
			
			console.log("db closed");
		});
	});
}