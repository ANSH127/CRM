const mongoose = require('mongoose');

const customFieldSchema = new mongoose.Schema({
  uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fields: [
    {
      name: { type: String, required: true },
      label: { type: String, required: true },
      type: { type: String, default: 'string' }, 
      required: { type: Boolean, default: false }
    }
  ]
});

module.exports = mongoose.model('CustomField', customFieldSchema);
