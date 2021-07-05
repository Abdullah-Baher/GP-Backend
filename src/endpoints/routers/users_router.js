const express = require('express')
const UsersController = require('../controllers/users_controller');
const auth = require('../middleware/auth');
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'src/uploads');
    },
    filename: function(req, file, cb) {
        cb(null, req.user._id + " " + file.originalname);
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

router.post('/users', UsersController.postUser);

router.post('/users/login', UsersController.loginUser);

router.post('/users/profile', [auth, upload.single('profilePicture')], UsersController.uploadProfilePicture);

router.patch('/users', auth, UsersController.updateUser);

router.get('/users', UsersController.getAllUsers);

router.get('/users/search', auth, UsersController.searchUsers);

router.get('/users/:userId', UsersController.getUser);

router.delete('/users', auth, UsersController.deleteUser);

module.exports = router;