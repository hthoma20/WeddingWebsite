const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.get('/get_invite_info', (req, res) => {
	res.json([
		{
			id : 0,
			guests: 0,
			members : [{firstName:'John',lastName:'Thoma'},{firstName:'Randi',lastName:'Thoma'}]
		},
		{
			id: 1,
			guests: 1,
			members : [{firstName:'Mary',lastName:'Thoma'}]
		}
	]);
	return;
	
	badChars= injectionChars(input);
	
	if(badChars != []){
		res.error(badChars);
		return;
	}
	
	getGroups(input).then(groups => {
		res.json(groups);
	});
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
	input is a name
	
	return a list of groups that
		match that name
		
	where a group is
		{
			group_id: number,
			members: [{
				first: string,
				last: string
			}]
		}
	}
*/
function getGroups(input){
	let groups= [];
	
	
	
	let query= `SELECT <groupid>, <firstname>, <lastname> FROM <groupid>
	 WHERE
		<lastname> LIKE input OR
		<firstname LIKE input'; 
	`;
	
	return db.query(query).then(result => formatResult(result));
}

function formatResult(result){
	return [];
}

module.exports= router;