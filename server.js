'use strict';

var express = require('express');
var app = express();
var jsonParser = require('body-parser').json;
var routes = require('./routes');
var mongoose = require('mongoose');
var logger = require("morgan");

app.use(logger("dev"));
app.use(jsonParser());

mongoose.connect('mongodb://localhost:27017/words');

var db = mongoose.connection;

db.on('error', function(err) {
    console.error('connection error:', err);
});

db.once('open', function() {
    console.log("db connection successful");
});

// app.use(function(req, res, next){
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// 	if(req.method === "OPTIONS") {
// 		res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE");
// 		return res.status(200).json({});
// 	}
// 	next();
// });


app.use('/word', routes);

app.use(function(req, res, next) {
    console.log("hello why is it coming here");
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message
    });

});

var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log("Express is running");
});
