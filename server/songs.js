const express = require('express');
const router = express.Router();
const db = require('./db.js');

const log= require('./log').logger;

/**
Expect a map like:
	{
		Title: "Thing",
		Artist: "Thinger"
	}
**/
router.post('/add_song', (req, res) => {
	let songInfo= req.body;
	log.info("New song: ", songInfo);
	
	console.log(songInfo);
	
	if(!validSong(songInfo)){
		log.error("Bad song body: ", rsvpMap);
		res.status(400).send("Bad body to add song");
		return;
	}
	
	let badChars= injectionChars(songInfo.Title);
	
	if(badChars.length > 0){
		log.info("Dangerous title ", songInfo.Title);
		res.status(400).send(badChars);
		return;
	}
	
	badChars= injectionChars(songInfo.Artist);
	
	if(badChars.length > 0){
		log.info("Dangerous artist ", songInfo.Artist);
		res.status(400).send(badChars);
		return;
	}
	
	addSong(songInfo);
	res.status(200).send("Added");
});

//mutate the songInfo to be valid if possible,
//return whether it is valid
function validSong(songInfo){	

	if(typeof(songInfo.Title) != 'string'){
		log.error("Not string in song title: ", songInfo.Title, " ", typeof(songInfo.Title));
		return false;
	}
	if(typeof(songInfo.Artist) != 'string'){
		log.error("Not string in song artist: ", songInfo.Artist, " ", typeof(songInfo.Artist));
		return false;
	}

	return true;
}


//return a list of strings that the
//string shouldn't include
function injectionChars(input){
	badwords= ['/*','*/','drop table'];

	//keep only those words that the input includes
	return badwords.filter(word => input.toLowerCase().includes(word));
}

//update the database to include the new song
function addSong(songInfo){	
	let query= `insert into Songs (Title, Artist) values ('${songInfo.Title}', '${songInfo.Artist}')`;

	log.info("Making query: ", query);
	db.query(query);
}


module.exports= router;