let now= new Date();

let year= 1900 + now.getYear();
let month= now.getMonth() + 1;
let day= now.getDate();
let hour= now.getHours();
let minute= now.getMinutes();
let	second= now.getSeconds();
let millis= now.getMilliseconds();

let timestamp= `${month}-${day}-${year}_${hour}-${minute}_${second}${millis}`;

const logger= require('simple-node-logger').createSimpleLogger(`./logs/${timestamp}.log`);

logger.setLevel('info');

const middleware= function(req, res, next){
	//if the request is for an html or not for a file, log it
	if(req.url.endsWith('.html') || !req.url.includes('.')){
		logger.info("Express: ", req.url);
	}
	else{
		logger.trace("Express: ", req.url);
	}

	next();
}

module.exports.logger= logger;
module.exports.express= middleware;