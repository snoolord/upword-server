'use strict';

var axios = require('axios');
var express = require('express');
var async = require('async');
var parseString = require('xml2js').parseString;
var router = express.Router();

var Word = require('./models').Word;
var util = require('./util/util');
var arrayUtil = require('./util/array-util');
var separateByPartsOfSpeech = require('./util/separate-by-parts-of-speech');

router.param('word', function(req, res, next, word) {
    console.log(word);
    Word.find({word: word}, function(err, docs){
        if (err) return next(err);
        if (!docs) {
            err = new Error("Not Found");
            err.status = 404;
            return next(err);
        }
        // var mappedWordResponse = {word: word};
        // for (let i = 0; i < docs.length; i++) {
        //     if (mappedWordResponse[docs[i].partOfSpeech]) {
        //         mappedWordResponse[docs[i].partOfSpeech].push(docs[i]);
        //     } else {
        //         mappedWordResponse[docs[i].partOfSpeech] = [docs[i]];
        //     }
        // }
        req.wordsByPartOfSpeech = separateByPartsOfSpeech(word, docs);
        return next();
    });
});

router.get('/:word', function(req, res, next) {
    // Word.find({}).exec(function(err, word) {
    // for (let i = 0; i < req.word.length; i++) {
    //     console.log(req.word[i].word, i);
    // }
    res.status = 201;
    res.json(req.wordsByPartOfSpeech)
    // });
});

router.post('/', function(req, res, next){
    // var word = new Word(req.body);
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
                // console.log(parsedJson);
                if (parsedJson.suggestion) {
                    res.status = 404;
                    res.json(parsedJson.suggestion);
                } else {
                    wordsWithSynonyms =
                    util.convertXMLResultsToWords(req.body.word, result);
                }
            });
            if (wordsWithSynonyms) {
                // console.log(wordsWithSynonyms);
                var formattedWords = [];
                async.each(wordsWithSynonyms, function(word, callback) {
                    var formattedWord = new Word(word);
                    formattedWord.save(function(err) {
                        if (err) return next(err);
                        formattedWords.push(formattedWord)
                        callback();
                    });
                }, function(err) {
                    let mappedWordResponse = separateByPartsOfSpeech(req.body.word, formattedWords);
                    res.status = 201;
                    res.json(mappedWordResponse);
                })
            }
        }).catch(function(error) {
            console.log(error);
        });
});

module.exports = router;
