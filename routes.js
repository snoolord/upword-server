'use strict';

var express = require('express');
var router = express.Router();
var Word = require('./models').Word;
var Synonym = require('./models').Synonym;
var parseString = require('xml2js').parseString;
var axios = require('axios');
var util = require('./util');
var async = require('async');
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
    axios
        .get(baseUrl + queryString + apiKey)
        .then(function(response) {
            var wordsWithSynonyms;
            parseString(response.data, function(err, result){
                wordsWithSynonyms =
                    util.convertXMLResultsToWords(req.body.word, result);
            });
            async.eachSeries(wordsWithSynonyms, function(wordPartOfSpeech, callback){
                var synonymApiRequests;
                wordPartOfSpeech.synonyms
                    .splice(wordPartOfSpeech.synonyms.indexOf(wordPartOfSpeech.word), 1);
                var synonymApiRequests = wordPartOfSpeech.synonyms.map(function(synonym) {
                    return util.fetchSynonyms(synonym);
                })
                axios
                    .all(synonymApiRequests)
                    .then(function(result){
                        result = result.map(function(synonym){
                            return synonym.data;
                        })
                        result = result.map(function(synonym){
                            var syn;
                            parseString(synonym, function(err, s){
                                syn = util.convertSynonymResults(s, wordPartOfSpeech.partOfSpeech);
                            });
                            return syn;
                        });
                        console.log(result);
                        var resultsWithSavedSynonyms = [];
                        async.eachSeries(result, function(synonym, cb){
                            var syn = new Synonym(synonym);
                            resultsWithSavedSynonyms.push(syn);
                            syn.save(cb);
                        }, function(err) {
                            wordPartOfSpeech.synonyms = resultsWithSavedSynonyms;
                        })
                    }).then(function() {
                        console.log(wordPartOfSpeech);
                        var formattedWord = new Word(wordPartOfSpeech);
                        formattedWord.save();
                    });
            }, function(err){
                let mappedWordResponse = {};
                for (let i = 0; i < wordsWithSynonyms.length; i++) {
                    if (mappedWordResponse[wordsWithSynonyms[i].partOfSpeech]) {
                        mappedWordResponse[wordsWithSynonyms[i].partOfSpeech].push(wordsWithSynonyms[i]);
                    } else {
                        mappedWordResponse[wordsWithSynonyms[i].partOfSpeech] = [wordsWithSynonyms[i]];
                    }
                }
                res.status = 201;
                res.json(mappedWordResponse)
            });
        }).catch(function(error) {
            console.log(error);
        });
});

module.exports = router;
