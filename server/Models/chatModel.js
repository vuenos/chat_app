const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    members: Array,
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const chatModel = mongoose.model("Chat", chatSchema);

module.exports = chatModel;
