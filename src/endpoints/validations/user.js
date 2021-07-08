const validator = require('validator');


const validateIncompleteData = reqBody => {
    if(!reqBody.email || !reqBody.username || !reqBody.password) {
        throw new Error('Incomplete data, please provide an email, username and password');
    }
}

const validateEmail = email => {
    if(!validator.default.isEmail(email)) {
        throw new Error('please provide an email');
    }
}

const validatePassword = password => {
    if(!validator.default.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1
    , minSymbols: 1, minNumbers: 1 })) {
        throw new Error('please provide a strong password');
    }
}

const validateIncompleteLoginData = reqBody => {
    if(!reqBody.email || !reqBody.password) {
        throw new Error('Incomplete data, please provide an email and password');
    }
}

module.exports = {
    validateIncompleteData,
    validateEmail,
    validatePassword,
    validateIncompleteLoginData
}
