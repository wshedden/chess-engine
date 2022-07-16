var express = require('express');

const PORT = 3000;

var app = express();
var server = app.listen(PORT);

app.use(express.static('public'));
console.log("Server is running");