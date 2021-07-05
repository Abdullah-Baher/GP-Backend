const Task = require('../models/task');


const taskCheck = async (req, res, next) => {
    try {
        const taskId = req.params.taskId;
        const task = await Task.findById(taskId);

        if(!task) {
            throw new Error('Invalid taskId');
        }

        req.task = task;
        next();
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}


module.exports = taskCheck;