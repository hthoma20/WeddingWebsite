const express = require('express');
const router = express.Router();
const db = require('./db.js');

/*
	send back a list of groups, where a group is:
	
	{
		id: number,
		members: [member],
	}
	
	and a member is:
	{
		id: number,
		firstName: string,
		lastName: string
	}
	
*/
router.get('/get_invite_info', (req, res) => {
	res.json([
		{
			id : 0,
			guests: 0,
			members : [{id:0,firstName:'John',lastName:'Thoma'},{id:1,firstName:'Randi',lastName:'Thoma'}]
		},
		{
			id: 1,
			guests: 1,
			members : [{id:2,firstName:'Mary',lastName:'Thoma'}]
		}
	]);
	return;
	
	badChars= injectionChars(input);
	
	if(badChars != []){
		res.error(badChars);
		return;
	}
	
	getGroupIds(input)
	.then(groupIds => Promise.all(groupIds.map(getGroup)))
	.then(groups => res.json(groups));
});

router.get('/get_group', (req, res) => {
	getGroup(input).then(result => res.json(result));
});

//return a list of strings that the
//string shouldn't include
function injectionChars(input){	
	badwords= ['/*','*/','+','#','--','||','%','@','waitfor',
		'select', 'drop table', ];

	//keep only those words that the input includes
	return badwords.filter(input.toLowerCase().includes);
}

/*
	return a promise that resolves with
	a list of group ids that match the given input
	
	a group id is said to match the input if it identifies a group where
	anyone in the group has a first name or last name which matches the input
*/
function getGroupIds(input){
	
	let query= `SELECT DISTINCT <groupid> FROM <rsvptable>
		WHERE <lastname> LIKE '${input}'
		OR <firstname LIKE '${input}';
	`;
	
	return db.query(query);
}

/*
	return a promise that resolves with a group object
	that is identified by the given groupId
*/
function getGroup(groupId){
	let query= `SELECT * FROM <rsvptable>
		WHERE <groupid>=${groupId};
	`;
	
	return db.query(query);
}

module.exports= router;