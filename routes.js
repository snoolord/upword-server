'use strict';

var axios = require('axios');
var express = require('express');
var async = require('async');
var parseString = require('xml2js').parseString;
var router = express.Router();

var Word = require('./models').Word;
var Suggested = require('./models').Suggested
var util = require('./util/util');
var arrayUtil = require('./util/array-util');
var separateByPartsOfSpeech = require('./util/separate-by-parts-of-speech');
var lookUpword = require('look-upword')

router.param('word', function(req, res, next, word) {
    Word.find({word: word}, function(err, docs){
        if (err) return next(err);
        if (docs.length === 0) {
            Suggested.findOne({word: word}, function (err, doc) {
                if (!doc) {
                    err = new Error("Not Found");
                    err.status = 404;
                    return next(err);
                }
                req.wordsByPartOfSpeech = doc
                return next()
            })
        } else {
            req.wordsByPartOfSpeech = separateByPartsOfSpeech(word, docs);
            return next();
        }
    });
});

router.get('/', function(req, res) {
    res.send("Hello");
});
router.get('/:word', function(req, res, next) {
    res.status = 201;
    res.json(req.wordsByPartOfSpeech)
});

router.post('/', function(req, res, next){
    var baseUrl = 'http://www.dictionaryapi.com/api/v1/references/thesaurus/xml/';
    var queryString = req.body.word;
    var apiKey = '?key=0b966b02-dd99-4a31-a735-2206edb9a8a5' ;

    console.log(lookUpword)
    // perform first api call to get the word
    // axios
    //     .get(baseUrl + queryString + apiKey)
    //     .then(function(response) {
    //         var wordsWithSynonyms;
    //         // I separated the words by part of speech and formatted it
    //         parseString(response.data, function(err, result){
    //             var parsedJson =
    //                 JSON.parse(JSON.stringify(result.entry_list));
    //             if (parsedJson.suggestion) {
    //                 res.status = 404;
    //                 var formattedSuggestion = {
    //                     word: req.body.word,
    //                     related: parsedJson.suggestion
    //                 }
    //                 var newSuggested = new Suggested(formattedSuggestion)
    //                 newSuggested.save(function(err) {
    //                 })
    //                 res.json({related: parsedJson.suggestion});
    //             } else {
    //                 wordsWithSynonyms =
    //                 util.convertXMLResultsToWords(req.body.word, result);
    //             }
    //         });
    //         /* if wordsWithSynonyms is populated then I can save all the words
    //          to the database*/
    //         if (wordsWithSynonyms) {
    //             var formattedWords = [];
    //             // I use async.each so that I can wait for all the saves to process
    //             // then the formattedWords are mapped to a response json
    //             async.each(wordsWithSynonyms, function(word, callback) {
    //                 var formattedWord = new Word(word);
    //                 formattedWord.save(function(err) {
    //                     if (err) return next(err);
    //                     formattedWords.push(formattedWord)
    //                     callback();
    //                 });
    //             }, function(err) {
    //                 let mappedWordResponse = separateByPartsOfSpeech(req.body.word, formattedWords);
    //                 res.status = 201;
    //                 res.json(mappedWordResponse);
    //             })
    //         }
    //     }).catch(function(error) {
    //         console.log(error);
    //     });
});

module.exports = router;
