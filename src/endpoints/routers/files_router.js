const express = require('express');
const Files_Controller = require('../controllers/files_controller');
const auth = require('../middleware/auth');


const router = express.Router();

router.post('/files', auth, Files_Controller.postFile);

router.patch('/files/:fileId', auth, Files_Controller.updateFileData);

router.patch('/files/name/:fileId', auth, Files_Controller.updateFileName);

router.get('/files/:fileId', auth, Files_Controller.getFileData);

router.delete('/files/:fileId', auth, Files_Controller.deleteFile);


module.exports = router;