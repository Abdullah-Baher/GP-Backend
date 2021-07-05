const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        default: '',
        trim: true
    },

    deadline: {
        type: String,
        required: true
    },

    members: [ { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true } ],

    project: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Project',
        required: true
    },

    status: {
        type: String,
        default: 'Tasks'
    },

    comments: [{
        creator: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true
        },

        content: {
            type: String,
            trim: true,
            required: true
        }
    }]
}, {
    timestamps: true
});


const Task = mongoose.model('Task', taskSchema);

module.exports = Task;