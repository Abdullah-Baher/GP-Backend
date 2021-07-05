const mongoose = require('mongoose')


const codeReviewSchema = new mongoose.Schema({
    file: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'File',
        required: true
    },


    content: {
        type: String,
        required: true,
        trim: true
    },

    creator: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});

const  CodeReview = mongoose.model("CodeReview", codeReviewSchema);

module.exports = CodeReview;