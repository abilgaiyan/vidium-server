const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const keys = require('../config/keys');

const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator/check');

const UploadVideo = require('../models/uploadVideo');
const User = require('../models/user');

// const s3 = new AWS.S3({
//   accessKeyId: keys.s3_vidium_access_key,
//   secretAccessKey: keys.s3_vidium_secretAccess_key
// }
// )
const s3 = new AWS.S3({
  accessKeyId: keys.s3_vidium_access_key,
  secretAccessKey: keys.s3_vidium_secretAccess_key,
  endpoint: 's3.ap-south-1.amazonaws.com',
  signatureVersion: 'v4',
  region: 'ap-south-1'
}
)

exports.awsVideoUpload = async (req, res, next) => {
  const videoextn = req.params.videotype || 'mp4'
  //const key =`${req.userId}/${uuid()}.mp4`;
  const key = `${req.userId}/${uuid()}.${videoextn}`;
  // console.log('key->', key);
  //get presigned url from amazon
  s3.getSignedUrl('putObject', {
    Bucket: keys.s3_vidium_bucket_name,
    ContentType: 'video/*',
    Key: key
  }, (err, url) => {
    return res.send({ key, url })
  })
}
exports.getUploadVideos = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  try {
    const totalItems = await UploadVideo.find().countDocuments();
    const uploadVideos = await UploadVideo.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: 'Fetched UploadVideos successfully.',
      uploadVideos: uploadVideos,
      totalItems: totalItems
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createUploadVideo = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  // if (!req.file) {
  //   const error = new Error('No image provided.');
  //   error.statusCode = 422;
  //   throw error;
  // }
  //const videoUrl = req.file.path;
  const title = req.body.title;
  const videoUrl = req.body.videoUrl;
  const description = req.body.description;
  const content = req.body.content;
  const videoFilename = req.body.videoFilename;
  const videoFilesize = req.body.videoFilesize;
  const status = req.body.status;

  const uploadvideo = new UploadVideo({
    title: title,
    videoUrl: videoUrl,
    description: description,
    content: content,
    videoFilename: videoFilename,
    videoFilesize: videoFilesize,
    status: status,
    creator: req.userId
  });
  try {
    await uploadvideo.save();
    const user = await User.findById(req.userId);
    //user.UploadVideos.push(uploadvideo);
    //await user.save();
    res.status(201).json({
      message: 'Upload created successfully!',
      UploadVideo: UploadVideo,
      creator: { _id: user._id, name: user.name }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUploadVideo = async (req, res, next) => {
  const UploadVideoId = req.params.videoId;
  const UploadVideo = await UploadVideo.findById(UploadVideoId);
  try {
    if (!UploadVideo) {
      const error = new Error('Could not find UploadVideo.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: 'UploadVideo fetched.', UploadVideo: UploadVideo });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateUploadVideo = async (req, res, next) => {
  const UploadVideoId = req.params.videoId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  //let videoUrl = req.body.video;

  let videoUrl = req.body.videoUrl;
  // if (req.file) {
  //   videoUrl = req.file.path;
  // }
  if (!videoUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }
  try {
    const UploadVideo = await UploadVideo.findById(UploadVideoId);
    if (!UploadVideo) {
      const error = new Error('Could not find UploadVideo.');
      error.statusCode = 404;
      throw error;
    }
    if (UploadVideo.creator.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    if (videoUrl !== UploadVideo.videoUrl) {
      clearImage(UploadVideo.videoUrl);
    }
    UploadVideo.title = title;
    UploadVideo.videoUrl = videoUrl;
    UploadVideo.content = content;
    const result = await UploadVideo.save();
    res.status(200).json({ message: 'UploadVideo updated!', UploadVideo: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteUploadVideo = async (req, res, next) => {
  const UploadVideoId = req.params.videoId;
  try {
    const UploadVideo = await UploadVideo.findById(UploadVideoId);

    if (!UploadVideo) {
      const error = new Error('Could not find UploadVideo.');
      error.statusCode = 404;
      throw error;
    }
    if (UploadVideo.creator.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    // Check logged in user
    clearImage(UploadVideo.videoUrl);
    await UploadVideo.findByIdAndRemove(UploadVideoId);

    const user = await User.findById(req.userId);
    user.UploadVideos.pull(UploadVideoId);
    await user.save();

    res.status(200).json({ message: 'Deleted UploadVideo.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
