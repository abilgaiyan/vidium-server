const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const organizationSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    attributes:{
        type:[{}]
    },
    fieldsPreference:{
        type:[{}]
    },
    status: {
        type: String,
        required: true
      },
  
  },
  { timestamps: true }
);

module.exports = mongoose.model('Organization', organizationSchema);
