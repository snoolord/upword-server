'use strict';

var express = require('express');
var app = express();
var jsonParser = require('body-parser').json;
var routes = require('./routes');
var mongoose = require('mongoose');

var port = process.env.PORT || 3000;

app.use(jsonParser());

mongoose.connect('mongodb://localhost:27017/sandbox');
var db = mongoose.connection;
db.on('error', function(err) {
    console.error('connection error:', err);
});

db.once('open', function() {
    console.log("db connection successful");
});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message
    })

})
app.use('./word', routes);
app.use(function(req, res, next) {
    req.body();
    next();
});


app.listen(port, function() {
    console.log("Express is running");
});
