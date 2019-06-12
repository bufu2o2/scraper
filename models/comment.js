const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    body: {
        type: String
    }
});

let Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;