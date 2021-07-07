const express = require('express');
const ChannelsController = require('../controllers/Channel_controller');
const auth = require('../middleware/auth');


const router = express.Router();

router.post('/channels', auth, ChannelsController.postChannel);

router.patch('/channels/:channelId', auth, ChannelsController.updateChannel);

router.get('/channels', auth, ChannelsController.getChannels);

router.get('/channels/:channelId', auth, ChannelsController.getChannel);

router.delete('/channels/:channelId', auth, ChannelsController.deleteChannel);


module.exports = router;