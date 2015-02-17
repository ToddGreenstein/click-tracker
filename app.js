//===================================
// Global Objects
//
//===================================
var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
require('./routes/routes.js')(app);

app.listen(3000);

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});
