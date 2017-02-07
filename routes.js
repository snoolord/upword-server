'use strict';

var express = require('express');
var router = express.Router();
var Word = require('./models').Word;
var parseString = require('xml2js').parseString;
var axios = require('axios');
var util = require('./util');

// var x = require('x-ray')();


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
    var baseUrl = 'http://www.dictionaryapi.com/api/v1/references/thesaurus/xml/';
    var queryString = req.body.word;
    var apiKey = '?key=0b966b02-dd99-4a31-a735-2206edb9a8a5' ;
    axios.get(baseUrl + queryString + apiKey)
        .then(function(response) {
            var wordsWithSynonyms;
            parseString(response.data, function(err, result){
                wordsWithSynonyms = util
                    .convertXMLResultsToWords(req.body.word, result);
            });
            console.log(wordsWithSynonyms);
        })
        .catch(function(error){
            console.log(error);
        })
    // word.save(function(err, word){
    //     if (err) return next(err);
    //     res.status(201);
    //     res.json(word);
    // })

});

// {
//     "entry_list": {
//         "$": {
//             "version": "1.0"
//         },
//         "entry": [
//             {
//                 "$": {
//                     "id": "test"
//                 },
//                 "term": [
//                     {
//                         "hw": [
//                             "test"
//                         ]
//                     }
//                 ],
//                 "fl": [
//                     "noun"
//                 ],
//                 "sens": [
//                     {
//                         "sn": [
//                             "1"
//                         ],
//                         "mc": [
//                             "a procedure or operation carried out to resolve an uncertainty"
//                         ],
//                         "vi": [
//                             {
//                                 "_": "will need to run some  on the blood sample to rule out blood poisoning",
//                                 "it": [
//                                     "tests"
//                                 ]
//                             }
//                         ],
//                         "syn": [
//                             "essay, experimentation, test, trial"
//                         ],
//                         "rel": [
//                             {
//                                 "_": "trial and error; dry run, shakedown; exercise, practice ( practise), rehearsal, tryout, workout; crucible, ordeal; attempt, effort, try",
//                                 "it": [
//                                     "also"
//                                 ]
//                             }
//                         ]
//                     },
//                     {
//                         "sn": [
//                             "2"
//                         ],
//                         "mc": [
//                             "a set of questions or problems designed to assess knowledge, skills, or intelligence"
//                         ],
//                         "vi": [
//                             {
//                                 "_": "applicants for the cashier's position must first take a simple math ",
//                                 "it": [
//                                     "test"
//                                 ]
//                             }
//                         ],
//                         "syn": [
//                             "exam, quiz, test"
//                         ],
//                         "rel": [
//                             "aptitude test, intelligence test, placement test; pretest, retest; board(s), midterm, midyear; catechism; audition; final; checkup, inspection, review; inquiry, interrogation, investigation, probe, research"
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "$": {
//                     "id": "test"
//                 },
//                 "term": [
//                     {
//                         "hw": [
//                             "test"
//                         ]
//                     }
//                 ],
//                 "fl": [
//                     "verb"
//                 ],
//                 "sens": [
//                     {
//                         "sn": [
//                             "1"
//                         ],
//                         "mc": [
//                             "to put (something) to a test"
//                         ],
//                         "vi": [
//                             {
//                                 "_": "please  this sample for the presence of lead",
//                                 "it": [
//                                     "test"
//                                 ]
//                             }
//                         ],
//                         "syn": [
//                             "sample, test"
//                         ],
//                         "rel": [
//                             "check (out), examine, experiment (with), explore, feel (out), investigate, research, study; resample, retest"
//                         ]
//                     },
//                     {
//                         "sn": [
//                             "2"
//                         ],
//                         "mc": [
//                             "to subject (a personal quality or faculty) to often excessive stress"
//                         ],
//                         "vi": [
//                             {
//                                 "_": "all of these unnecessary questions are  my patience",
//                                 "it": [
//                                     "testing"
//                                 ]
//                             }
//                         ],
//                         "syn": [
//                             "strain, stretch, tax, test"
//                         ],
//                         "rel": [
//                             "demand, exact, importune, press, pressure, push; aggravate, agitate, annoy, bother, exasperate, gall, get (to), gnaw (at), grate, harass, harry, hassle, irk, irritate, nettle, pain, peeve, pester, rile, spite, vex"
//                         ]
//                     }
//                 ]
//             }
//         ]
//     }
// }
module.exports = router;
