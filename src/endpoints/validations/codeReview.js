const validateIncompleteData = reqBody => {
    if(!reqBody.file || !reqBody.content || !reqBody.creator) {
        throw new Error('Incomplete data, please provide a file (fileId), review content (content) and creatorId (creator)');
    }
}


module.exports = { validateIncompleteData };