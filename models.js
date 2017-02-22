'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// var SynonymSchema = new Schema({
//     word: String,
//     partOfSpeech: String,
//     definitions: [String],
//     createdAt: { type: Date, default: Date.now }
// });
var SuggestedSchema= new Schema({
    word: String,
    related: [String]
    createdAt: {type: Date, default: Date.now}
})

var WordSchema = new Schema({
    word: String,
    partOfSpeech: String,
    definition: String,
    synonyms: [String],
    related: [String],
    createdAt: { type: Date, default: Date.now }
});
WordSchema.pre('save', function (next) {
    var self = this;
    Word.find({word : self.word, partOfSpeech: self.partOfSpeech}, function (err, docs) {
        if (!docs.length){
            next();
        } else{
            console.log('word exists:',self.name);
            next(new Error("word exists!"));
        }
    });
}) ;


// var Synonym = mongoose.model("Synonym", SynonymSchema);
var Suggested = mongoose.model('Suggested', SuggestedSchema)
var Word = mongoose.model("Word", WordSchema);

// module.exports.Synonym = Synonym;
module.exports.Word = Word;
module.exports.Suggested = Suggested;
