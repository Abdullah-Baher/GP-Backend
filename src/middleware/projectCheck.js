const Project = require("../models/project");


const projectCheck = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const project = await Project.findById(projectId);

        if(!project) {
            throw new Error('Invalid projectId');
        }

        const isProjectCreator = (project.creator.toString() === req.user._id.toString());

        if(!isProjectCreator) {
            throw new Error('Project creator only can modify this project');
        }

        req.project = project;
        next();

    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}

module.exports = projectCheck;