const express = require('express');
const MessagesController = require('../controllers/Message_controller');
const auth = require('../middleware/auth');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = "/src/endpoints/pictures/"

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, uuidv4() + req.user._id  + " " + file.originalname);
    }
});

const upload = multer({ storage,
    limits: {
        fileSize: 1024 * 1024 * 7
    },

    fileFilter: function(req, file, cb) {
        if(!file.originalname.toLowerCase().match(/\.(jpg|png|gif|jpeg)$/)){
            return cb(new Error('please provide an image that is not more than 7MB'))
        }

        cb(null, true)
    }
});

const router = express.Router();

router.post('/messages', auth, MessagesController.postMessage);

router.patch('/messages/:messageId', auth, MessagesController.updateMessage);

router.patch('/messages/picture/:messageId', [auth, upload.single('photo')], MessagesController.uploadMessagePicture);

router.get('/messages', auth, MessagesController.getMessages);

router.get('/messages/:messageId', auth, MessagesController.getMessage);

router.delete('/messages/:messageId', auth, MessagesController.deleteMessage);


module.exports = router;