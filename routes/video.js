const express = require('express');

const videoController = require('../controllers/video');

const router = express.Router();

// GET /feed/posts
router.get('/videos', videoController.getPosts);

// POST /feed/post
router.post('/video', videoController.createPost);

module.exports = router;