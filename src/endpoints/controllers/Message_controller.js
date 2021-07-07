const Channel = require('../models/channel');
const Message = require('../models/message');
const User = require('../models/user');


const postMessage = async (req, res) => {
    try {
        const message = new Message(req.body);
        const channel = await Channel.findById(message.channel);
        const sender = await User.findById(message.sender);

        if(!channel) {
            return res.status(400).send({ message: 'Invalid channelId' });
        }

        if(!sender) {
            return res.status(400).send({ message: 'Invalid senderId' });
        }

        await message.save();
        res.status(201).send(message);
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}

const updateMessage = async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const message = await Message.findById(messageId);

        if(!message) {
            return res.status(400).send({ message: 'Invalid messageId' });
        }

        if(req.body.content && Object.keys(req.body).length === 1) {
            message.content = req.body.content;
        } else {
            return res.status(400).send({ message: 'Invalid updates' });
        }

        await message.save();
        res.send(message);
    } catch (e) {
        res.status(400).send({ message: e.message });
    } 
}

const getMessages = async (req, res) => {
    try {
        const channelId = req.query.channelId;
        let messages;

        if(channelId) {
            const channel = await Channel.findById(channelId);
            if(!channel) {
                return res.status(400).send({ message: 'Invalid channelId' });
            }

            messages = await Message.find({ channel: channelId }).populate("channel").populate("sender");

        }

        else {
            messages = await Message.find().populate("channel").populate("sender");
        }

        res.send(messages);
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}

const getMessage = async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const message = await Message.findById(messageId);

        if(!message) {
            return res.status(400).send({ message: 'Invalid messageId' });
        }

        res.send(message);
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}

const uploadMessagePicture = async (req, res) => {
   try {
       const messageId = req.params.messageId;
       const message = await Message.findById(messageId);

       if(!message) {
           return res.status(400).send({ message: 'Invalid messageId' });
       }

       message.photo = req.file.path;
       await message.save();
       res.send(message);
   } catch (e) {
       res.status(400).send({ message: e.message });
   }
}

const deleteMessage = async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const message = await Message.findById(messageId);

        if(!message) {
            return res.status(400).send({ message: 'Invalid messageId' });
        }

        await message.remove();
        res.send(message);
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}


module.exports = {
    postMessage,
    updateMessage,
    getMessages,
    getMessage,
    deleteMessage,
    uploadMessagePicture
}