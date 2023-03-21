const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const fs = require("fs");

exports.create = async (req, res) => {
  const { filename } = req.file;

  const { postDescription, postLocation, userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (user.isBanned) {
      res.status(500).json({
        errorMessage: `You are not able to post while being banned`,
      });
      return;
    }
    let newPost = new Post();

    newPost.description = postDescription;
    newPost.image = filename;
    newPost.location = postLocation;
    newPost.creatorUsername = creatorUsername;
    newPost.creator = userId;
    newPost.stars = 0;
    await newPost.save();

    user.posts.unshift(newPost);
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
    const loggedInUserId = req.params.loggedInUserId;
    const loggedInUser = await User.findById(loggedInUserId);

    if (loggedInUser.savedPosts.includes(postId)) {
      res.json({
        postObject: post,
        creatorObject: await User.findById(post.creator),
        isPostSaved: true,
      });
    } else {
      res.json({
        postObject: post,
        creatorObject: await User.findById(post.creator),
        isPostSaved: false,
      });
    }
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
    const postOwnerId = req.params.ownerId;

    const postOwner = await User.findById(postOwnerId);

    postOwner.posts.forEach((p) => {
      if (p == postId) {
        postOwner.posts.remove(p);
      }
    });

    postOwner.savedPosts.forEach((p) => {
      if (p == postId) {
        postOwner.savedPosts.remove(p);
      }
    });

    await postOwner.save();

    const post = await Post.findById(postId);

    post.comments.forEach(async (c) => {
      await Comment.findByIdAndDelete(c);
    });

    const deletedPost = await Post.findByIdAndDelete(postId);

    fs.unlink(`uploads/${deletedPost.image}`, (err) => {
      if (err) throw err;
      console.log(
        "Image successfully deleted from filesystem: ",
        deletedPost.image
      );
    });

    res.json(deletedPost);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.likePost = async (req, res) => {
  let isLiked = true;
  const postId = req.params.postId;
  const likerId = req.params.likerId;

  const post = await Post.findById(postId);
  const postOwnerId = post.creator;
  const postOwner = await User.findById(postOwnerId);

  for (let i = 0; i < post.likers.length; i++) {
    if (post.likers[i] == likerId) {
      post.likers.remove(post.likers[i]);
      isLiked = false;
      break;
    }
  }

  if (isLiked) {
    post.stars += 1;
    post.likers.push(likerId);
    postOwner.stars += 1;
  } else {
    post.stars -= 1;
    postOwner.stars -= 1;
  }

  await post.save();
  await postOwner.save();

  res.json({
    successMessage: "Post liked.",
  });
};

exports.getPostLikers = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    const promise = post.likers.map(async (uId) => {
      const likerObject = await User.findById(uId);
      return likerObject;
    });

    const likerObjects = await Promise.all(promise);

    res.json(likerObjects);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.postComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commenterId = req.params.userId;

    const post = await Post.findById(postId);
    const commenter = await User.findById(commenterId);
    const { comment } = req.body;

    let newComment = new Comment();
    newComment.text = comment;
    newComment.stars = 0;
    newComment.owner = commenter;
    await newComment.save();

    post.comments.unshift(newComment);

    await post.save();

    res.status(200).json({
      successMessage: `Posted successfully!`,
    });
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.getPostsComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const loggedInUserId = req.params.loggedInUserId;
    const post = await Post.findById(postId);

    const promise = post.comments.map(async (cId) => {
      const commentObject = await Comment.findById(cId);
      if (loggedInUserId == commentObject.owner) {
        return {
          commentObject: commentObject,
          commentOwner: await User.findById(commentObject.owner),
          ableToDelete: true,
        };
      }
      return {
        commentObject: commentObject,
        commentOwner: await User.findById(commentObject.owner),
        ableToDelete: false,
      };
    });

    const commentObjects = await Promise.all(promise);

    res.json(commentObjects);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.likeComment = async (req, res) => {
  try {
    let isLiked = true;
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId);
    const likerId = req.params.likerId;
    const commentOwnerId = req.params.commentOwnerId;
    const commentOwner = await User.findById(commentOwnerId);

    for (let i = 0; i < comment.likers.length; i++) {
      if (comment.likers[i] == likerId) {
        comment.likers.remove(comment.likers[i]);
        isLiked = false;
        break;
      }
    }

    if (isLiked) {
      comment.stars += 1;
      comment.likers.push(likerId);
      commentOwner.stars += 1;
    } else {
      comment.stars -= 1;
      commentOwner.stars -= 1;
    }

    await comment.save();
    await commentOwner.save();

    res.json({
      successMessage: "Comment liked.",
    });
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId);
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    for (let i = 0; i < post.comments.length; i++) {
      if (post.comments[i] == commentId) {
        post.comments.remove(commentId);
        break;
      }
    }

    await Comment.findByIdAndDelete(commentId);
    await post.save();

    res.json({
      successMessage: "Comment deleted.",
    });
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};
