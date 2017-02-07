var x = require('x-ray')();

var scrapeForSynonyms = function(word, req, res) {
    var synonyms;
    var callback = function(syns) {
        console.log(syns);
        synonyms = syns;
    };
    x('http://www.thesaurus.com/browse/hello?s=t', ['.relevancy-list ul li a .text'])(function(err, syns){
            synonyms = syns
        }
    );
    return synonyms.map(syn => syn.replace('/', ''));
    }
}

module.exports = scrapeForSynonyms;
