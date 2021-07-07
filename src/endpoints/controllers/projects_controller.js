const fs = require('fs')
const Project = require('../models/project');
const User = require('../models/user');
const ProjectsValidations = require('../validations/project');
const path ="/src/endpoints/projects/"

var mkdirp = require('mkdirp');
const postProject = async (req, res) => {
    try {
        ProjectsValidations.validateIncompleteData(req.body);
        const project = new Project({
            ...req.body,
            creator: req.user._id,
            members: req.body.members,
            path: ""
        });

        for await (const memberId of project.members) {
            const member = await User.findById(memberId);
            if(!member) {
                return res.status(400).send({ message: 'Invalid memberId' });
            }
        }
       
        project.path = path + req.body.name +'_' + project._id;

        
        await fs.promises.mkdir(project.path);
        await project.save();
        res.status(201).send(project);
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}

const updateProject = async (req, res) => {
    try {
        
        const updates = Object.keys(req.body);
        const validUpdates = ['name', 'visibility'];

        const isValidUpdate = updates.every( update => validUpdates.includes(update));

        if(!isValidUpdate) {
            return res.status(400).send({ message: 'Invalid updates' });
        }


        if(updates.includes('name')) {
            await fs.promises.rename(req.project.path, path + req.body.name + '_' + req.project._id);
            req.project.path = path + req.body.name + '_' + req.project._id;
            req.project.name = req.body.name;
        }

        if(updates.includes('visibility')) {
            req.project.visibility = req.body.visibility;
        }

        await req.project.save();
        res.send(req.project);
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}

const addMember = async (req, res) => {
    try {
        
        const memberId = req.body.memberId;

        const newMember = await User.findById(memberId);

        if(!newMember) {
            return res.status(400).send({ message: 'Invalid memberId' });
        }

        req.project.members.push(memberId);
        await req.project.save();
        res.send(req.project);

    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}

const removeMember = async (req, res) => {
    try {
        
        const memberId = req.body.memberId;

        const member = await User.findById(memberId);

        if(!member) {
            return res.status(400).send({ message: 'Invalid memberId' });
        }

        req.project.members = req.project.members.filter(mid => mid.toString() !== memberId.toString());
        await req.project.save();
        res.send(req.project);

    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}

const deleteProject = async (req, res) => {
    try {

        await req.project.remove();
        res.send(req.project);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
}

const getProjects = async (req, res) => {
    try {
        const creatorId = req.query.creatorId;
        let projects;

        if(creatorId) {
            const creator = await User.findById(creatorId);
            if(!creator) {
                return res.status(400).send({ message: 'Invalid userId' });
            }
            projects = await Project.find({creator: creatorId}).populate("creator").populate("members")
            .sort({ createdAt: -1 });/*.execPopulate()*/
        }

        else {
            projects = await Project.find().populate("creator").populate("members")
            /*.execPopulate()*/.sort({ createdAt: -1 });
        }

        res.send(projects);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
}

const getProject = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const project = await Project.findById(projectId).populate("members").populate("creator").sort({ createdAt: -1 });

        if(!project) {
            return res.status(400).send({ message: 'Invalid projectId' });
        }

        res.send(project);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
}


const getAllFilesNames = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const project = await Project.findById(projectId);

        if(!project) {
            return res.status(400).send({ message: 'Invalid projectId' });
        }
        if(!fs.existsSync(project.path)) {
            return res.status(400).send({ message: 'Project does not exist' });
        }
        const filesNames = await fs.promises.readdir(project.path);
        res.send(filesNames);
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}

module.exports = {
    postProject,
    updateProject,
    addMember,
    removeMember,
    deleteProject,
    getProjects,
    getProject,
    getAllFilesNames
}