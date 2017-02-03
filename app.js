'use strict';

var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

app.use(function(req, res, next) {
    console.log("First");
    next();
});

app.use(function(req, res, next) {
    console.log("second");
    next();
})

app.listen(port, function() {
    console.log("Express is running");
});
