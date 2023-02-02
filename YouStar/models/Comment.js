var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema(
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", schema);
