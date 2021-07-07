const Project = require('../models/project');
const Task = require('../models/task');
const User = require('../models/user');
const TasksValidations = require('../validations/task');

const postTask = async (req, res) => {
    try {
        TasksValidations.validateIncompleteData(req.body);
        const task = new Task({
            ...req.body,
            members: req.body.members
        });

        const project = await Project.findById(task.project);
        if(!project) {
            return res.status(400).send({ message: 'Invalid projectId' });
        }

        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}


const updateTask = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const validUpdates = ['name', 'description', 'deadline', 'status'];

        const isValidUpdate = updates.every(update => validUpdates.includes(update));

        if(!isValidUpdate) {
            return res.status(400).send({ message: 'Invalid updates' });
        }
        //deadline is date or string
        updates.forEach(update => req.task[update] = req.body[update]);
        await req.task.save();
        res.send(req.task);
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}

//check for project creator when deleting task
const deleteTask = async (req, res) => {
    try {
        await req.task.remove();
        res.send(req.task);
    } catch (e) {
        res.status(500).send({ message: e.message });
    } 
}

const addMemberToTask = async (req, res) => {
    try {
        const memberId = req.body.memberId;
        const member = await User.findById(memberId);

        if(!member) {
            return res.status(400).send({ message: 'Invalid memberId' });
        }

        req.task.members.push(memberId);
        await req.task.save();
        res.send(req.task);
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}


const removeMemberFromTask = async (req, res) => {
    try {
        const memberId = req.body.memberId;
        const member = await User.findById(memberId);

        if(!member) {
            return res.status(400).send({ message: 'Invalid memberId' });
        }

        req.task.members = req.task.members.filter(val => val.toString() !== memberId.toString());
        await req.task.save();
        res.send(req.task);

    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}


const getTasks = async (req, res) => {
    try {
        const memberId = req.query.memberId;
        let tasks;

        if(memberId) {
            const member = await User.findById(memberId);
            if(!member) {
                return res.status(400).send({ message: 'Invalid userId' });
            }
            tasks = await Task.find({ members: { "$in": [memberId] } }).populate("members").populate("project")
            .populate("comments.creator");
        } 
        else {
            tasks = await Task.find().populate("members").populate("project").populate("comments.creator");
        }

        res.send(tasks);
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}

const getTaskById = async(req, res) => {
    try {
        const taskId = req.params.taskId;
        const task = await Task.findById(taskId).populate("members").populate("project").populate("comments.creator");
        
        if(!task) {
            return res.status(400).send({ message: 'Invalid taskId' });
        }

        res.send(task);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
}

const addComment = async (req, res) => {
    try {
        const creatorId = req.body.creatorId;
        const content = req.body.content;

        const creator = await User.findById(creatorId);
        if(!creator) {
            return res.status(400).send({ message: 'Invalid comment creatorId' });
        }

        const commentData = {
            creator: creatorId,
            content: content
        }

        req.task.comments.push(commentData);
        await req.task.save();
        res.send(req.task);
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}

//to be continued with update and delete comment inshaallah

module.exports = {
    postTask,
    updateTask,
    deleteTask,
    addMemberToTask,
    removeMemberFromTask,
    getTasks,
    getTaskById,
    addComment
}