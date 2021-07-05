const validateIncompleteData = reqBody => {
    if(!reqBody.name || !reqBody.language  || !reqBody.members) {
        throw new Error('Incomplete data, please provide a name, language and project members (members)');
    }
}

module.exports = { validateIncompleteData }