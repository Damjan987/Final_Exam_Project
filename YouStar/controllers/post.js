const Post = require("../models/Post");
const User = require("../models/User");
const fs = require("fs");

exports.create = async (req, res) => {
  const { filename } = req.file;

  const { postDescription, postLocation, creatorUsername, userId } = req.body;

  try {
    let newPost = new Post();

    newPost.description = postDescription;
    newPost.image = filename;
    newPost.location = postLocation;
    newPost.creatorUsername = creatorUsername;
    newPost.creator = userId;
    newPost.stars = 0;
    await newPost.save();

    const user = await User.findById(userId);
    user.posts.push(newPost);
    await user.save();

    res.status(200).json({
      successMessage: `Posted successfully!`,
    });
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.readAll = async (req, res) => {
  try {
    const posts = await Post.find({});

    res.status(200).json({
      posts,
    });
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.details = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    res.json(post);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.update = async (req, res) => {
  const postId = req.params.postId;

  const oldPost = await Post.findByIdAndUpdate(postId, req.body);

  res.json({
    successMessage: "Post successfully updated",
  });
};

// TODO: see if deleting of post image really works
exports.delete = async (req, res) => {
  try {
    const postId = req.params.postId;
    const deletedPost = await Post.findByIdAndDelete(postId);

    fs.unlink(`uploads/${deletedPost.image}`, (err) => {
      if (err) throw err;
    });

    res.json(deletedPost);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.likePost = async (req, res) => {
  const postId = req.params.postId;
  const likerId = req.params.likerId;

  const post = await Post.findById(postId);
  const postOwnerId = post.creator;
  const postOwner = await User.findById(postOwnerId);

  post.stars += 1;
  post.likers.push(likerId);
  postOwner.stars += 1;

  await post.save();
  await postOwner.save();

  res.json({
    successMessage: "Post liked.",
  });
};
