const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  description: String,
  custom: { type: Object, default: {} },
  specifications: {
    type: [
      {
        name: { type: String, required: true },
        spec: {
          type: Map,
          of: String,
          default: {}
        }
      }
    ],
    default: []
  }
});

module.exports = mongoose.model("Project", projectSchema);

