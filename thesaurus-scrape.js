var x = require('x-ray')();

var scrapeForSynonyms = function(word, req, res) {
    var synonyms;
    var callback = function(err, syns) {
        synonyms = syns;
    };
    synonyms = x('http://www.thesaurus.com/browse/hello?s=t', ['.relevancy-list ul li a .text'])(function(err, syns){
        console.log(syns);
        }
    );
}
scrapeForSynonyms();

module.exports = scrapeForSynonyms;
