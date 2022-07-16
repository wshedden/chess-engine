var express = require('express');

var app = express();
var server = app.listen(process.env.PORT || 3000, '0.0.0.0');

app.use(express.static('public'));
console.log("Server is running");