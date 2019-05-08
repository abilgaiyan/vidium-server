const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uploadVideoSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    videoUrl: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    videoFilename: {
      type: String,
      required: true
    },
    videoFilesize: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('UploadVideo', uploadVideoSchema);
