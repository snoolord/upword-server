'use strict';

var express = require('express');
var router = express.Router();
var Word = require('./models').Word;
var mergeOptions = require('./util');
var x = require('x-ray')();

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


    x(`http://www.thesaurus.com/browse/best?s=t`, {
        partOfSpeech: '.synonym-description .txt',
        description: '.ttl'
    })(function(error, word){
        console.log(word.word = req.body.word);
        console.log(word);
        x('http://www.thesaurus.com/browse/hello?s=t', ['.relevancy-list ul li a .text'])(function(e, syns){
            console.log(syns);
            // word.save(function(err, word){
            //     if (err) return next(err);
            //     res.status(201);
            //     res.json(word);
            // })
        }
    ));

});


var getWordInfo = function(err, word) {

}

module.exports = router;
