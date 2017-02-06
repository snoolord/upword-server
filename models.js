'use strict';
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SynonymSchema = new Schema({
    word: String,
    partOfSpeech: String,
    definition: String,
    createdAt: { type: Date, default: Date.now }
});

var WordSchema = new Schema({
    word: String,
    synonyms: [SynonymSchema],
    createdAt: { type: Date, default: Date.now }
});

var Word = mongoose.model("Word", WordSchema);
module.exports.Word = Word;
