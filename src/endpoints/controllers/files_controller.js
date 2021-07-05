const fs = require('fs');
const os = require('os');
const File = require('../models/file');
const Project = require('../models/project');
const FileValidations = require('../validations/file');

const postFile = async (req, res) => {
    try {
        FileValidations.validateIncompleteData(req.body);
        const file = new File(req.body);
        const project = await Project.findById(req.body.project);

        if(!project) {
            return res.status(400).send({ message: 'Invalid projectId' });
        }
    
        if(fs.existsSync(project.path + '/' + file.name + file.extension)) {
            return res.status(400).send({ message: 'File already exists' });
        }

        await fs.promises.writeFile(project.path + '/' + file.name + file.extension);
        await file.save();
        res.status(201).send(file);
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}

const updateFileData = async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const file = await File.findById(fileId);
        const project = await Project.findById(file.project);

        if(!file) {
            return res.status(400).send({ message: 'Invalid fileId' });
        }

        if(!fs.existsSync(project.path + '/' + file.name + file.extension)) {
            return res.status(400).send({ message: 'File does not exist' });
        }

        

        await fs.promises.writeFile(project.path + '/' + file.name + file.extension, req.body.fileContent);
        res.send();
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}

const getFileData = async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const file = await File.findById(fileId);

        if(!file) {
            return res.status(400).send({ message: 'Invalid fileId' });
        }
        const project = await Project.findById(file.project);

        const fileContent = await fs.promises.readFile(project.path + '/' + file.name + file.extension)

        res.send(fileContent);
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}

const updateFileName = async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const file = await File.findById(fileId);

        if(!file) {
            return res.status(400).send({ message: 'Invalid fileId' });
        }

        const project = await Project.findById(file.project);

        await fs.promises.rename(project.path + '/' + file.name + file.extension, project.path + '/' + req.body.name + file.extension);

        file.name = req.body.name;

        await file.save();
        res.send(file)
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}

const deleteFile = async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const file = await File.findById(fileId);

        if(!file) {
            return res.status(400).send({ message: 'Invalid fileId' });
        }

        const project = await Project.findById(file.project);

        await fs.promises.unlink(project.path + '/' + file.name + file.extension);
        await file.remove();
        res.send(file);
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}


module.exports = {
    postFile,
    updateFileData,
    getFileData,
    updateFileName,
    deleteFile
}