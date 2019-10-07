const express = require('express');
const path = require('path');

let app = express();

app.use(express.static(path.join(__dirname, '../client')));

app.listen(3000);

console.log("Listening at port 3000...");