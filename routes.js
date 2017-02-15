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
    // API returns the word in its list of synonyms
    // need to delete it from the synonyms list
    wordPartOfSpeech.synonyms
        .splice(wordPartOfSpeech.synonyms.indexOf(wordPartOfSpeech.word), 1);

    synonymApiRequests = wordPartOfSpeech.synonyms.map(function(synonym) {
        // fills synonymApiRequests with axios.get requests for axios.all
        return util.fetchSynonyms(synonym);
    })
    // axios.all will fire all get requests and return a promise
    // the promise that is returned has the result from all the get requests

    axios
        .all(synonymApiRequests)
        .then(function(result){
            // console.log("after synonym api requests");
            result = result.map(function(synonym){
                if (synonym.data) {
                    return synonym.data;
                } else {
                    return synonym;
                }
            })
            // I map over the result to grab the data from the response
            let results = [];
            var syn;
            for (let i = 0; i < result.length; i++) {
                /*
                Results from the data can fail and be caught and return an object
                {
                    fail: true,
                    synonym: "insert word"
                }
                or succeed and return a string of xml
                */
                // if ( typeof result[i] === 'object'){
                    // console.log(result[i]);
                // }
                // I check if the result is a string and then I
                // pass it into a function to parse the string
                if (typeof result[i] === 'string') {
                    parseString(result[i], function(err, s){
                        var syns = util.convertSynonymResults(s, wordPartOfSpeech.partOfSpeech);
                        // console.log(syns, "LINE 81");
                        if (syns.length !== 0 ) {
                            results.push(syns);
                        }
                    })
                } else {
                    // console.log(result[i], "this is a catch!");
                    // console.log(result[i].word, "in the catch", 'LINE 86');
                    if (result[i]) {
                        results.push(result[i].word)
                    } else {
                        console.log("UNDEFINED IN CATCH");
                    }
                }
            }
            for (let i = 0; i < results.length; i++) {
                if (results[i]) {
                    console.log(results[i]);
                } else {
                    // console.log("UNDEFINEDD");
                }
            }
            // result = result.map(function(synonym){
            //     var syn;
            //     return syn;
            // });
            // arrayUtil.cleanArray(results);
            // var wordSynonyms = [];
            // async.each(result, function(synonym, cb){
            //     console.log("Process synonym", synonym.word);
            //     var syn = new Synonym(synonym);
            //     wordSynonyms.push(syn)
            //     syn.save(cb);
            // }, function(err) {
            //     console.log("SYNONYMS SHOULD BE SAVED!");
            //     wordPartOfSpeech.synonyms = wordSynonyms
            //     // callback();
            //     // console.log(wordPartOfSpeech, "Async call!");
            // });
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
                var parsedJson =
                    JSON.parse(JSON.stringify(result.entry_list));
                console.log(parsedJson);
                if (parsedJson.suggestion) {
                    res.status = 404;
                    res.json(parsedJson.suggestion);
                } else {
                    wordsWithSynonyms =
                    util.convertXMLResultsToWords(req.body.word, result);
                }
            });
            if (wordsWithSynonyms) {
                async.each(wordsWithSynonyms, processWord, function(err){
                    console.log("this is after the synonymss are saved");
                    var formattedWords = [];
                    async.each(wordsWithSynonyms, function(word, callbac) {
                        console.log(word.word);
                        console.log("FINALLY SAVING it !!");
                        var formattedWord = new Word(word);
                        console.log(formattedWord);
                        formattedWords.push(formattedWord)
                        formattedWord.save(callbac);

                    }, function(err){
                        let mappedWordResponse = {word: req.body.word};
                        for (let i = 0; i < formattedWords.length; i++) {
                            if (mappedWordResponse[formattedWords[i].partOfSpeech]) {
                                mappedWordResponse[formattedWords[i].partOfSpeech].push(formattedWords[i]);
                            } else {
                                mappedWordResponse[formattedWords[i].partOfSpeech] = [formattedWords[i]];
                            }
                        }
                        res.status = 201;
                        res.json(mappedWordResponse)
                    });
                });
            }
        }).catch(function(error) {
            console.log(error);
        });
});

module.exports = router;
