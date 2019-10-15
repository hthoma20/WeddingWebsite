const express = require('express');
const app = express();
const path = require('path');

const root_dir= path.join(__dirname, 'client');
const port = 3000;


app.use(express.static(root_dir));

app.use(require('./server/invitation'));

// app.get('/', (req, res) => {
	// console.log("request for index");
	// res.sendFile(path.join(__dirname,'client/index.html'));
// });

// app.get('/rsvp.html', (req, res) => {
	// console.log("request for rsvp");
	// res.sendFile(path.join(__dirname,'client/rsvp.html'));
// });

app.listen(port);
console.log(`listening on port ${port}`);