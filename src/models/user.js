const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    
    password: {
        type: String,
        required: true,
        trim: true
    },

    profilePicture: {
        type: String,
        default: ""
    }
},{
    timestamps: true
});

userSchema.methods.generateAuthToken = async function() {
    const user = this;

    const token = await jwt.sign({ _id: user._id.toString() }, process.env.ACCESS_Token_Secret);

    return token;

}


userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if(!user) {
        throw new Error('please provide a correct email');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        throw new Error('please provide a correct password');
    }

    return user;
}

userSchema.pre('save', async function (next) {
    const user = this

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }

    next();
});

userSchema.pre('remove', function (next) {
    const user = this

    if(user.profilePicture) {
        fs.unlink(user.profilePicture, (err => {
            throw new Error(err.message);
        }))
    }

    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;

