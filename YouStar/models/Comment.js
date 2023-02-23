const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    text: { type: String, required: true },
    stars: { type: Number, required: false },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", schema);
