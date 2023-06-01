const mongoose = require("mongoose");
const { models } = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: String,
    senderId: String,
    text: String,
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const messageModel = mongoose.model("Message", messageSchema);

module.exports = messageModel;
