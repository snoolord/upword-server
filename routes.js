'use strict';

var express = require('express');
var router = express.Router();
var Word = require('./models').Word;
var Synonym = require('./models').Synonym;
var parseString = require('xml2js').parseString;
var axios = require('axios');
var util = require('./util');
var arrayUtil = require('./array-util');
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

var processWord = function(wordPartOfSpeech, callback){
    console.log("Processing word", wordPartOfSpeech.word);
    var synonymApiRequests;

    wordPartOfSpeech.synonyms
        .splice(wordPartOfSpeech.synonyms.indexOf(wordPartOfSpeech.word), 1);

    synonymApiRequests = wordPartOfSpeech.synonyms.map(function(synonym) {
        return util.fetchSynonyms(synonym);
    })

    axios
        .all(synonymApiRequests)
        .then(function(result){
            console.log("after synonym api requests");
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
            arrayUtil.cleanArray(result);
            var wordSynonyms = [];
            async.each(result, function(synonym, cb){
                console.log("Process synonym", synonym.word);
                var syn = new Synonym(synonym);
                wordSynonyms.push(syn)
                syn.save(cb);
            }, function(err) {
                console.log("SYNONYMS SHOULD BE SAVED!");
                wordPartOfSpeech.synonyms = wordSynonyms
                callback();
                // console.log(wordPartOfSpeech, "Async call!");
            });
        });
};


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
            async.each(wordsWithSynonyms, processWord, function(err){
                console.log("this is after the synonymss are saved");
                var formattedWords = [];
                async.each(wordsWithSynonyms, function(word, callbac) {
                    console.log("FINALLY SAVING it !!");
                    var formattedWord = new Word(word);
                    console.log(formattedWord);
                    formattedWords.push(formattedWord)
                    formattedWord.save(callbac);

                }, function(err){
                    let mappedWordResponse = {};
                    for (let i = 0; i < formattedWords.length; i++) {
                        console.log(formattedWords[i].word, formattedWords[i].synonyms);
                        if (mappedWordResponse[formattedWords[i].partOfSpeech]) {
                            mappedWordResponse[formattedWords[i].partOfSpeech].push(formattedWords[i]);
                        } else {
                            mappedWordResponse[formattedWords[i].partOfSpeech] = [formattedWords[i]];
                        }
                    }
                    res.status = 201;
                    res.json(mappedWordResponse)
                })
            });
        }).catch(function(error) {
            console.log(error);
        });
});

module.exports = router;
