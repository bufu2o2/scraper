const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let HeadlineSchema = new Schema({
    title: {
        type: String,
        unique: true
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

let Headline = mongoose.model('Headline', HeadlineSchema);

module.exports = Headline;