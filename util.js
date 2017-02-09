// const mergeOptions = function(obj1,obj2){
//     var obj3 = {};
//     for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
//     for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
//     return obj3;
// }
var axios = require('axios');

exports.convertXMLResultsToWords = function(word, result) {
    var words = JSON.parse(JSON.stringify(result)).entry_list.entry;
    var wordsWithFieldsParsed = [];
    for (var i = 0; i < words.length; i++) {
        let currWord = {word: word};
        for (let j = 0; j < words[i].sens.length; j++) {
            currWord.partOfSpeech = words[i].fl[0];
            currWord.definition = words[i].sens[j].mc[0];
            currWord.synonyms = words[i].sens[j].syn;
            currWord.related = words[i].sens[j].rel;
            wordsWithFieldsParsed.push(currWord);
        }
    }
    return wordsWithFieldsParsed;

}

exports.convertSynonymResults = function(synonym) {
    var syn = JSON.parse(JSON.stringify(synonym)).entry_list.entry;
    return syn;

}

exports.fetchSynonyms = function(synonym) {
    var baseUrl = "http://www.dictionaryapi.com/api/v1/references/collegiate/xml/"
    var queryString = synonym.word;
    var apiKey = '?key=3df2e79a-e305-4a64-8913-a4f326eaaa5f'

    return axios
        .get(baseUrl + queryString + apiKey);
}
// module.exports = mergeOptions;
