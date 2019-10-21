const express = require('express');
const app = express();
const path = require('path');

const root_dir= path.join(__dirname, 'client');
const port = 3000;

app.use(express.static(root_dir));

app.use(require('./server/invitation'));

app.listen(port);
console.log(`listening on port ${port}`);