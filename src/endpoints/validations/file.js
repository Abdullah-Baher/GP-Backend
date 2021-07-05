const validateIncompleteData = reqBody => {
    if(!reqBody.name || !reqBody.project || !reqBody.extension) {
        throw new Error('Incomplete data, please provide a name, projectId (project) and extension (ex: .py)');
    }
}

module.exports = { validateIncompleteData }