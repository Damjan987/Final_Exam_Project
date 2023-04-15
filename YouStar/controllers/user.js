const User = require("../models/User");
const Post = require("../models/Post");
const fs = require("fs");

exports.readAll = async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200).json({
      users,
    });
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.read = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    res.json(user);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.update = async (req, res) => {
  const userId = req.params.userId;
  const { username, status, isAccountPublic } = req.body;

  const user = await User.findById(userId);

  if (req.file != null) {
    const { filename } = req.file;
    user.profileImage = filename;
  }
  user.username = username;
  user.status = status;
  user.isAccountPublic = isAccountPublic;

  await user.save();

  res.json({
    successMessage: "User successfully updated",
  });
};

exports.followUser = async (req, res) => {
  const followRequesterId = req.params.followRequesterId;
  const userId = req.params.userId;

  const followRequester = await User.findById(followRequesterId);
  const user = await User.findById(userId);

  followRequester.follows.push(user);
  await followRequester.save();

  user.followers.push(followRequester);
  await user.save();

  res.json({
    successMessage: "Follow request executed successfully",
  });
};

exports.unfollowUser = async (req, res) => {
  const unfollowRequesterId = req.params.unfollowRequesterId;
  const userId = req.params.userId;

  const unfollowRequester = await User.findById(unfollowRequesterId);
  const user = await User.findById(userId);

  unfollowRequester.follows.forEach((u) => {
    if (u == userId) {
      unfollowRequester.follows.remove(u);
    }
  });
  await unfollowRequester.save();

  user.followers.forEach((u) => {
    if (u == unfollowRequesterId) {
      user.followers.remove(u);
    }
  });
  await user.save();

  res.json({
    successMessage: "Unfollow request executed successfully",
  });
};

// TODO: ovaj delete je kompliciran jer se moraju izbrisat sve slike od tog usera
exports.delete = async (req, res) => {
  try {
    const userId = req.params.userId;
    const deletedUser = await User.findByIdAndDelete(userId);

    fs.unlink(`uploads/${deletedUser.profileImage}`, (err) => {
      if (err) throw err;
    });

    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.getUsersBySeachName = async (req, res) => {
  try {
    // 0 -> all users
    // 1 -> follows
    // 2 -> followers
    // 3 -> likers
    const searchMode = req.params.searchMode;

    let users = [];

    if (searchMode == 0) {
      const allUsers = await User.find({});

      allUsers.forEach((u) => {
        if (
          u.username.toLowerCase().includes(req.params.searchName.toLowerCase())
        ) {
          users.push(u);
        }
      });
    } else if (searchMode == 1) {
      const loggedInUserId = req.params.loggedInUserId;
      const loggedInUser = await User.findById(loggedInUserId);
      const promise = loggedInUser.follows.map(async (uId) => {
        const followObject = await User.findById(uId);
        return followObject;
      });

      const followsObjects = await Promise.all(promise);

      followsObjects.forEach((fo) => {
        if (
          fo.username.toLowerCase().includes(req.params.searchName.toLowerCase())
        ) {
          users.push(fo);
        }
      });
    } else if (searchMode == 2) {
      const loggedInUserId = req.params.loggedInUserId;
      const loggedInUser = await User.findById(loggedInUserId);
      const promise = loggedInUser.followers.map(async (uId) => {
        const followerObject = await User.findById(uId);
        return followerObject;
      });

      const followerObjects = await Promise.all(promise);

      followerObjects.forEach((fo) => {
        if (
          fo.username.toLowerCase().includes(req.params.searchName.toLowerCase())
        ) {
          users.push(fo);
        }
      });
    } else {
      const postId = req.params.postId;
      const post = await Post.findById(postId);
      const promise = post.likers.map(async (uId) => {
        const likerObject = await User.findById(uId);
        return likerObject;
      });

      const likerObjects = await Promise.all(promise);

      likerObjects.forEach((lo) => {
        if (
          lo.username.toLowerCase().includes(req.params.searchName.toLowerCase())
        ) {
          users.push(lo);
        }
      });
    }

    res.status(200).json({
      users,
    });
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.getUsersFollows = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    const promise = user.follows.map(async (uId) => {
      const followObject = await User.findById(uId);
      return followObject;
    });

    const followsObjects = await Promise.all(promise);

    res.json(followsObjects);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.getUsersFollowsIds = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    const promise = user.follows.map(async (uId) => {
      return uId;
    });

    const followsIds = await Promise.all(promise);

    res.json(followsIds);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.getUsersFollowers = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    const promise = user.followers.map(async (uId) => {
      const followerObject = await User.findById(uId);
      return followerObject;
    });

    const followersObjects = await Promise.all(promise);

    res.json(followersObjects);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.getUsersFollowsCount = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    res.json(user.follows.length);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.getUsersFollowerCount = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    res.json(user.followers.length);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.getUsersPostCount = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    res.json(user.posts.length);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

function sortOn(property) {
  return function (a, b) {
    if (a[property] > b[property]) {
      return -1;
    } else if (a[property] < b[property]) {
      return 1;
    } else {
      return 0;
    }
  };
}

exports.getPostFeed = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    const userFollows = user.follows;

    const promise_1 = userFollows.map(async (u) => {
      const userObjects = await User.findById(u);
      return userObjects;
    });

    const userFollowsObjects = await Promise.all(promise_1);

    const promise_2 = userFollowsObjects.map((u) => {
      if (!u.isBanned) {
        return u.posts;
      }
    });

    const postIds = await Promise.all(promise_2);

    const extractedPostIds = [];

    postIds.map((l) => {
      l.map((pId) => {
        extractedPostIds.push(pId);
      });
    });

    const promise_3 = extractedPostIds.map(async (pId) => {
      return await Post.findById(pId);
    });

    const sortedExtractedPosts = (await Promise.all(promise_3)).sort(
      sortOn("createdAt")
    );

    const promise_4 = sortedExtractedPosts.map(async (p) => {
      if (user.savedPosts.includes(p._id)) {
        return {
          postObject: p,
          creatorObject: await User.findById(p.creator),
          isPostSaved: true,
        };
      } else {
        return {
          postObject: p,
          creatorObject: await User.findById(p.creator),
          isPostSaved: false,
        };
      }
    });

    const postFeed = await Promise.all(promise_4);

    res.json(postFeed);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.getUsersPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    const promise = user.posts.map(async (p) => {
      const postObjects = await Post.findById(p);
      return postObjects;
    });

    const postObjects = await Promise.all(promise);

    res.json(postObjects);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.getUsersSavedPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    const promise = user.savedPosts.map(async (p) => {
      const postObjects = await Post.findById(p);
      return postObjects;
    });

    const postObjects = await Promise.all(promise);

    res.json(postObjects);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.savePost = async (req, res) => {
  const userId = req.params.userId;
  const postId = req.params.postId;

  const user = await User.findById(userId);
  const post = await Post.findById(postId);

  user.savedPosts.unshift(post);

  await user.save();

  res.json({
    successMessage: "Post saved successfully!",
  });
};

exports.unsavePost = async (req, res) => {
  const userId = req.params.userId;
  const postId = req.params.postId;

  const user = await User.findById(userId);
  user.savedPosts.forEach((p) => {
    if (p == postId) {
      user.savedPosts.remove(p);
    }
  });

  await user.save();

  res.json({
    successMessage: "Post saved successfully!",
  });
};

exports.getMostFollowedUser = async (req, res) => {
  try {
    const mostFollowedUserObject = await User.findOne().sort({ followers: -1 });

    res.status(200).json(mostFollowedUserObject);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.getMostStarUser = async (req, res) => {
  try {
    const mostStarUserObject = await User.findOne().sort({ stars: -1 });

    res.status(200).json(mostStarUserObject);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.getMostLikedPost = async (req, res) => {
  try {
    const mostLikedPostObject = await Post.findOne().sort({ stars: -1 });

    res.status(200).json(mostLikedPostObject);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.getMostCommentedPost = async (req, res) => {
  try {
    const mostCommentedPostObject = await Post.findOne().sort({ comments: -1 });

    res.status(200).json(mostCommentedPostObject);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.banUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    user.isBanned = true;

    await user.save();

    res.json({
      successMessage: "User banned",
    });
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.unbanUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    user.isBanned = false;

    await user.save();

    res.json({
      successMessage: "User unbanned",
    });
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};
