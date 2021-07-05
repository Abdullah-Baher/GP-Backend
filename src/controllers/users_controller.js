const fs = require('fs');
const User = require('../models/user')
const UsersValidations = require('../validations/user');

// Do not send an image with postUser api use uploadProfilePicture instead
const postUser = async (req, res) => {
    try {
        UsersValidations.validateIncompleteData(req.body);
        UsersValidations.validateEmail(req.body.email);
        UsersValidations.validatePassword(req.body.password);

        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch(e) {
        res.status(400).send({ message: e.message });
    }
}

const loginUser = async (req, res) => {
    try {
        UsersValidations.validateIncompleteLoginData(req.body);
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send();
    }
}


const uploadProfilePicture = async (req, res) => {
    try {
        
        if(req.user.profilePicture) {
            fs.unlink(req.user.profilePicture, (err => {
                if(err) {
                    console.log(err.message)
                } else {
                    req.user.profilePicture = req.file.path;
                }
            }))
            
        } else {
            req.user.profilePicture = req.file.path;
        }
        

        await req.user.save();

        res.send(req.user);

    } catch (e) {
        res.status(400).send({ message: e.message });
    }

}

const updateUser = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const validUpdates = ['email', 'username', 'password'];

        const isValidUpdate = updates.every(update => validUpdates.includes(update));
        
        if(!isValidUpdate) {
            return res.status(400).send({ message: 'Invalid updates' })
        }

        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save();

        res.send(req.user)

    } catch (e) {
        res.status(400).send({ message: e.message });
    }

}


const getUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if(!user) {
            //throw new Error('please provide a correct user id');
            return res.status(400).send({ message: 'Invalid userId' });
        }

        res.send(user)
    } catch (e) {
        res.status(400).send({ message: e.message })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (e) {
        res.status(500).send({ message: e.message })
    }
}

const deleteUser = async (req, res) => {
    try {

        await req.user.remove(); // add pre remove user
        res.send(req.user);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
}

const searchUsers = async (req, res) => {
    try {
        const partOfName = req.query.name || '';
        const users = await User.find({ username: { $regex: partOfName.toString(), $options: 'i' } }).limit(10);
        res.send(users);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
}

module.exports = {
    postUser,
    loginUser,
    uploadProfilePicture,
    updateUser,
    getUser,
    getAllUsers,
    deleteUser,
    searchUsers
}