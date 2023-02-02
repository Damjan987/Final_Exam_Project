const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const UserSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    birthday: { type: Date, required: true },
    gender: { type: String, required: true },
    password: {
      type: String,
      required: true,
    },
    isAccountPublic: { type: Boolean, default: false },
    profileImage: { type: String, required: false },
    role: {
      type: Number,
      default: 0,
    },
    status: { type: String, required: false },
    stars: { type: Number, default: 0, required: false },
    posts: [
      {
        type: ObjectId,
        ref: "Post",
      },
    ],
    savedPosts: [
      {
        type: ObjectId,
        ref: "Post",
      },
    ],
    followers: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    follows: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
