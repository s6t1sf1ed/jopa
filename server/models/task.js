const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  projectId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Project' },
  title: { type: String, required: true },
  description: String,
  deadline: String,
}, {
  timestamps: true 
});

module.exports = mongoose.model('Task', taskSchema);