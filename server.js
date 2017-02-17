'use strict';

var nr = require('newrelic');
var express = require('express');
var app = express();
var jsonParser = require('body-parser').json;
var routes = require('./routes');
var mongoose = require('mongoose');
var logger = require("morgan");

app.use(logger("dev"));
app.use(jsonParser());

// var uri = process.env.MONGOLAB_URI ||'mongodb://localhost:27017/words'
mongoose.connect("mongodb://heroku_285vgks2:806qvj4flfb5o42h6v2oahvhil@ds153699.mlab.com:53699/heroku_285vgks2")

app.use('/word', routes);

app.use(function(req, res, next) {
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

// keep dyno awake
