const express = require('express');
const router = express.Router();

router.get('/get_invite_info', (req, res) => {
	first= req.query.first_name;
	last= req.query.last_name;
	
	res.send(`${first} ${last}`);
});


module.exports= router;