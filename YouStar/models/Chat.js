const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = Schema(
  {
    member1: { type: Schema.Types.ObjectId, ref: "User", required: true },
    member2: { type: Schema.Types.ObjectId, ref: "User", required: true },
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;
