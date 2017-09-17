var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var port = 5555;
var app = express();
var index = require('./routers/index');
var router = require('./routers/router');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use('/', index);
app.use('/tasks', router);

app.listen(port, function() {
    console.log('listening on port: ', port);
});