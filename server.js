const express = require('express');
const app = express();

const root_dir= './client';
const port = 3000;


app.use(express.static(root_dir));

app.use(require('./server/invitation'));

app.listen(port);
console.log(`listening on port ${port}`);