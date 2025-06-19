const mongoose = require('mongoose');

const projectFieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  key: { type: String, required: true },
  type: {
    type: String,
    enum: ['string', 'number', 'date'], // см. ниже
    default: 'string'
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

projectFieldSchema.index({ user: 1, key: 1 }, { unique: true }); // 👈 ключ уникален только для одного пользователя

module.exports = mongoose.model('ProjectField', projectFieldSchema);
