const express = require('express');
const { body } = require('express-validator/check');

const uploadVideoController = require('../controllers/uploadVideo');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /upload/videos
router.get('/videos', isAuth, uploadVideoController.getUploadVideos);

// POST /upload/video
router.post(
  '/video',
  isAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  uploadVideoController.createUploadVideo
);

router.get('/video/:videoId', isAuth, uploadVideoController.getUploadVideo);

router.put(
  '/video/:videoId',
  isAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  uploadVideoController.updateUploadVideo
);

router.delete('/video/:videoId', isAuth, uploadVideoController.deleteUploadVideo);

module.exports = router;
