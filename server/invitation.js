const express = require('express');
const router = express.Router();
const db = require('./db.js');

const log= require('./log').logger;

router.get('/get_invite_info', (req, res) => {
	let input= req.query.input;
	
	log.info("Search: ", input);
	
	let badChars= injectionChars(input);
	
	if(badChars.length > 0){
		log.info("Dangerous search ", input);
		res.status(400).send(badChars);
		return;
	}
	
	getGroupIds(input)
	.then(groupIds => Promise.all(groupIds.map(getGroup)))
	.then(groups => res.json(groups))
	.catch(error => {
		log.error("Search error: ", error);
		res.status(500).send(error);
	});
});

/**
Expect a map like:
	guest_id : {
		attending_ceremony: true,
		attending_reception: false
	}
**/
router.post('/update_rsvp', (req, res) => {
	let rsvpMap= req.body;
	log.info("Update rsvp: ", rsvpMap);
	
	if(!validRSVPUpdate(rsvpMap)){
		log.error("Bad rsvp update body: ", rsvpMap);
		res.status(400).send("Bad body to update rsvp");
		return;
	}
	
	updateRSVP(rsvpMap);
	res.status(200).send("Updated");
});

function validRSVPUpdate(rsvpMap){
	for(guest_id in rsvpMap){
		if(!Number.isInteger(parseInt(guest_id))){
			log.error("Bad guest id in rsvp: ", guest_id);
			return false;
		}
		
		for(field in rsvpMap[guest_id]){
			if(field != 'attending_ceremony' && field != 'attending_reception'){
				log.error("Bad key in rsvp: ", field);
				return false;
			}
			
			if(typeof(rsvpMap[guest_id][field]) != 'boolean'){
				log.error("Not boolean in rsvp: ", rsvpMap[guest_id][field], " ", typeof(rsvpMap[guest_id][field]));
				return false;
			}
		}
	}
	
	return true;
}


//return a list of strings that the
//string shouldn't include
function injectionChars(input){
	badwords= ['/*','*/','+','#','--','||','%','@','waitfor',
		'select', 'drop table', 'insert', 'update'];

	//keep only those words that the input includes
	return badwords.filter(word => input.toLowerCase().includes(word));
}

//update the database based on the given input
function updateRSVP(rsvpMap){
	for(guest_id in rsvpMap){
		let setters= Object.keys(rsvpMap[guest_id]).map(attending_location => 
			`${attending_location}=${rsvpMap[guest_id][attending_location]}`);
		
		setters= setters.join(',');
		
		let query= `update Invitation set ${setters} where guest_id=${guest_id}`;
		
		log.info("Making query: ", query);
		db.query(query);
	}
}

/*
	return a promise that resolves with
	a list of group ids that match the given input
	
	a group id is said to match the input if it identifies a group where
	anyone in the group has a first name or last name which matches the input
*/
function getGroupIds(input){
	
	let query= `SELECT DISTINCT group_id FROM Invitation
		WHERE last_name LIKE '${input}'
		OR first_name LIKE '${input}';
	`;
	
	//get the results and parse out the id's
	return db.query(query).then(result => result.map(row => row.group_id));
}

/*
	return a promise that resolves with a group object
	that is identified by the given groupId
*/
function getGroup(groupId){
	let query= `SELECT * FROM Invitation
		WHERE group_id=${groupId};
	`;
	
	//create a group from the row
	return db.query(query).then(row => {
		return {
			group_id: groupId,
			members: row
		};
	});
}

module.exports= router;