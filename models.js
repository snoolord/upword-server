'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SynonymSchema = new Schema({
    word: String,
    partOfSpeech: String,
    definitions: [String],
    createdAt: { type: Date, default: Date.now }
});

var WordSchema = new Schema({
    word: String,
    partOfSpeech: String,
    definition: String,
    synonyms: [String],
    related: [String],
    createdAt: { type: Date, default: Date.now }
});

var Synonym = mongoose.model("Synonym", SynonymSchema);
var Word = mongoose.model("Word", WordSchema);

module.exports.Synonym = Synonym;
module.exports.Word = Word;
