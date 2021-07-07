const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    channel: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Channel',
        required: true
    },
    
    content: {
        type: String,
        default: "",
        trim: true
    },

    sender: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },

    photo: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;