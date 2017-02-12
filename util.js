// const mergeOptions = function(obj1,obj2){
//     var obj3 = {};
//     for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
//     for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
//     return obj3;
// }
'use strict';

var axios = require('axios');

exports.convertXMLResultsToWords = function(word, result) {
    var words = JSON.parse(JSON.stringify(result)).entry_list.entry;
    var wordsWithFieldsParsed = [];
    for (var i = 0; i < words.length; i++) {
        let currWord = {word: word};
        for (let j = 0; j < words[i].sens.length; j++) {
            console.log(currWord.word);
            currWord.partOfSpeech = words[i].fl[0];
            currWord.definition = words[i].sens[j].mc[0];
            currWord.synonyms = returnArrayOfStrings(words[i].sens[j].syn)[0].split(', ');
            currWord.related = words[i].sens[j].rel;
            wordsWithFieldsParsed.push(JSON.parse(JSON.stringify(currWord)));
        }
    }
    return wordsWithFieldsParsed;

}

exports.convertSynonymResults = function(synonym, partOfSpeech) {
    var syns = JSON.parse(JSON.stringify(synonym)).entry_list.entry;
    if (typeof syns === 'undefined') return '';
    for (let i = 0; i < syns.length; i++) {
    //     // here I am returning the first one that matches the part of speech
    //     // TODO: add functionality with arrays
    // console.log(typeof syns[i].fl);
    // console.log(syns[i].fl[0]);
        if (syns[i].fl[0] === partOfSpeech) {
            var matchingSyn = syns[i];
            if (!matchingSyn) {
                return '';
            }
            var matchingSynResult = {};
            matchingSynResult.word = matchingSyn.ew[0];
            matchingSynResult.partOfSpeech = partOfSpeech;
            matchingSynResult.definitions = returnArrayOfStrings(matchingSyn.def[0].dt) ;
            return matchingSynResult;
        }
    }
    return '';
}

exports.fetchSynonyms = function(synonym) {
    var baseUrl = "http://www.dictionaryapi.com/api/v1/references/collegiate/xml/"
    var queryString = synonym;
    var apiKey = '?key=3df2e79a-e305-4a64-8913-a4f326eaaa5f'
    return axios
        .get(baseUrl + queryString + apiKey).catch(function() {
            console.log(synonym, "CATCHED");
            return {
                fail: true,
                synonym: synonym
            };
        });
}

var returnNullOnFailedRequest = function () {
    return null;
}

var returnArrayOfStrings = function(definitions) {
    var resultDefinitions = [];
    for (let i = 0; i < definitions.length; i++) {
        if (typeof definitions[i] === 'string') {
            resultDefinitions.push(definitions[i]);
        } else {
            resultDefinitions.push(definitions[i]["_"]);
        }
    }
    return resultDefinitions
}
// module.exports = mergeOptions;
