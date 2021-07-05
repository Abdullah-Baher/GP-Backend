const express = require('express');
const CodeReviewsController = require('../controllers/codeReview_contoller');
const auth = require('../middleware/auth');

const router = express.Router();


router.post('/codeReview', auth, CodeReviewsController.postCodeReview);

router.patch('/codeReview/:codeReviewId', auth, CodeReviewsController.updateCodeReview);

router.get('/codeReview', auth, CodeReviewsController.getCodeReviews);

router.get('/codeReview/:codeReviewId', auth, CodeReviewsController.getCodeReviewById);

router.delete('/codeReview/:codeReviewId', auth, CodeReviewsController.deleteCodeReview);

module.exports = router;