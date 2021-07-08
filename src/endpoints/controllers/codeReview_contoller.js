const CodeReview = require('../models/codeReview');
const File = require('../models/file');
const User = require('../models/user');
const CodeReviewValidations = require('../validations/codeReview');

const postCodeReview = async (req, res) => {
    try {
        CodeReviewValidations.validateIncompleteData(req.body);
        const codeReview = new CodeReview(req.body);
        
        const file = await File.findById(codeReview.file);
        if(!file) {
            return res.status(400).send({ message: 'Invalid fileId' });
        }

        const creator = await User.findById(codeReview.creator);
        if(!creator) {
            return res.status(400).send({ message: 'Invalid creatorId' });
        }

        await codeReview.save();
        res.status(201).send(codeReview);
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}

const updateCodeReview = async (req, res) => {
    try {
        const codeReviewId = req.params.codeReviewId;
        const codeReview = await CodeReview.findById(codeReviewId);

        if(!codeReview) {
            return res.status(400).send({ message: 'Invalid codeReviewId' });
        }

        if(req.body.content && Object.keys(req.body).length === 1) {
            codeReview.content = req.body.content;
        } else {
            return res.status(400).send({ message: 'Invalid updates' });
        }

        await codeReview.save();
        res.send(codeReview);
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}

const getCodeReviews = async (req, res) => {
    try {
        const fileId = req.query.fileId;
        let codeReviews;

        if(fileId) {
            const file = await File.findById(fileId);
            if(!file) {
                return res.status(400).send({ message: 'Invalid fileId' });
            }

            codeReviews = await CodeReview.find({ file: fileId }).populate("file").populate("creator");
        } else {
            codeReviews = await CodeReview.find().populate("file").populate("creator");
        }

        res.send(codeReviews);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
}

const getCodeReviewById = async (req, res) => {
    try {
        const codeReviewId = req.params.codeReviewId;
        const codeReview = await CodeReview.findById(codeReviewId).populate("file").populate("creator");

        if(!codeReview) {
            return res.status(400).send({ message: 'Invalid codeReviewId' });
        }

        res.send(codeReview);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
}

const deleteCodeReview = async (req, res) => {
    try {
        const codeReviewId = req.params.codeReviewId;
        const codeReview = await CodeReview.findById(codeReviewId).populate("file").populate("creator");

        if(!codeReview) {
            return res.status(400).send({ message: 'Invalid codeReviewId' });
        }

        await codeReview.remove();
        res.send(codeReview);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
}

module.exports = {
    postCodeReview,
    updateCodeReview,
    getCodeReviews,
    getCodeReviewById,
    deleteCodeReview
}
