const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },

    type: {
        type: String,
        trim: true,
        required: true
    },

    project: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Project",
        required: true
    }
    
}, {
    timestamps: true
});


const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;