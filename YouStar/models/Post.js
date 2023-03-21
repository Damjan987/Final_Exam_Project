const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    description: { type: String, required: true },
    image: { type: String, required: true },
    location: { type: String, required: false },
    creatorUsername: { type: String, required: false },
    stars: { type: Number, default: 0 },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    likers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
