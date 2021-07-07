const Channel = require('../models/channel');
const Project = require('../models/project');

const postChannel = async (req, res) => {
    try {
        const channel = new Channel(req.body);
        
        const project = await Project.findById(channel.project);

        if(!project) {
            return res.status(400).send({ message: 'Invalid projectId' });
        }

        await channel.save();
        res.status(201).send(channel);

    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}

const updateChannel = async (req, res) => {
    try {
        const channelId = req.params.channelId;
        const channel = await Channel.findById(channelId);

        if(!channel) {
            return res.status(400).send({ message: 'Invalid channelId' });
        }

        if(req.body.name && Object.keys(req.body).length === 1) {
            channel.name = req.body.name;
        } else {
            return res.status(400).send({ message: 'Invalid updates' });
        }

        await channel.save();
        res.send(channel)
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}


const getChannels = async (req, res) => {
    try {
        const projectId = req.query.projectId;
        let channels;

        if(projectId) {
            const project = await Project.findById(projectId);
            if(!project) {
                return res.status(400).send({ message: 'Invalid projectId' });
            }

            channels = await Channel.find({ project: projectId }).populate("project");
        }

        else {
            channels = await Channel.find().populate("project");
        }

        res.send(channels);
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}

const getChannel = async (req, res) => {
    try {
        const channelId = req.params.channelId;
        const channel = await Channel.findById(channelId);

        if(!channel) {
            return res.status(400).send({ message: 'Invalid channelId' });
        }

        res.send(channel);
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}


const deleteChannel = async (req, res) => {
    try {
        const channelId = req.params.channelId;
        const channel = await Channel.findById(channelId);

        if(!channel) {
            return res.status(400).send({ message: 'Invalid channelId' });
        }

        await channel.remove();
        res.send(channel);
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}


module.exports = {
    postChannel,
    updateChannel,
    getChannels,
    getChannel,
    deleteChannel
}