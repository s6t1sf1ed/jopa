const mongoose = require('mongoose');

const specificationFieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  key: { type: String, required: true },
  type: { type: String, enum: ['string', 'number', 'date'], required: true }, // ✅ исправлено
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('SpecificationField', specificationFieldSchema);
