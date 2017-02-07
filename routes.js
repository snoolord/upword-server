'use strict';

var express = require('express');
var router = express.Router();
var Word = require('./models').Word;

var scrapeForSynonyms = require('./thesaurus-scrape');

// router.param('word', function(req, res, next, word) {
//     Word.findOne({word: word}, function(err, doc){
//         if (err) return next(err);
//         if (!doc) {
//             err = new Error("Not Found");
//             err.status = 404;
//             return next(err);
//         }
//         req.word = doc;
//         return next();
//     });
// });

router.get('/:word', function(req, res, next) {
    Word.find({}).exec(function(err, word) {
        if (err) return next(err);
        res.json(word);
    });
});

router.post('/', function(req, res, next){
    var word = new Word(req.body);
    scrapeForSynonyms(word.word, req, res);

    word.save(function(err, word){
        if (err) return next(err);
        res.status(201);
        res.json(word);
    })
});

module.exports = router;
