const mongoose = require('mongoose');
const fs = require('fs');
const File = require('./file');
const Channel = require('./channel');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    visibility: {
        type: Boolean,
        default: true
    },

    path: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    language: {
        type: String,
        required: true,
        trim: true
    },

    creator: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },

    members: [ { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true } ],
}, {
    timestamps: true
});


projectSchema.pre('remove', async function (next) {
    const project = this;
    await fs.promises.rmdir(project.path);
    await File.deleteMany({ project: project._id });
    await Channel.deleteMany({ project: project._id });
    next();
})


const Project = mongoose.model('Project', projectSchema);

module.exports = Project;