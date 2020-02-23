const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const logger= require('./server/log');

const root_dir= path.join(__dirname, 'client');
const port = 3000;

app.use(logger.express);
app.use(express.static(root_dir));
app.use(bodyParser.json());

app.use(require('./server/invitation'));
app.use(require('./server/songs'));

app.listen(port);
console.log(`listening on port ${port}`);