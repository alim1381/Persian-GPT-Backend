const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    text: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    aiSide: { type: Boolean, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("message", messageSchema, "message");
