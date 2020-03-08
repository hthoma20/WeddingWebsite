const sqlite3 = require('sqlite3');

const log= require('./log').logger;


module.exports.query= function(query){
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