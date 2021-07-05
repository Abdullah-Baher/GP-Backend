const mongoose = require('mongoose');


const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    project: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Project',
        required: true
    },

    extension: {
        type: String,
        required: true
    }
    
}, {
    timestamps: true
})

const File = mongoose.model('File', fileSchema);

module.exports = File;