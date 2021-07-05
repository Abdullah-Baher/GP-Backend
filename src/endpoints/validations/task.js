const validateIncompleteData = reqBody => {
    if(!reqBody.name || !reqBody.deadline || !reqBody.members || !reqBody.project) {
        throw new Error('Incomplete data, please provide a name, deadline, members and project (projectId)');
    }
}

module.exports = { validateIncompleteData };