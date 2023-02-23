const User = require("../models/User");
const Post = require("../models/Post");

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

  const oldUser = await User.findByIdAndUpdate(userId, req.body);

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
    const users = await User.find({
      username: { $regex: req.params.searchName },
    });

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

const loadPostFeed = async (userId) => {
  const user = await User.findById(userId);
  const userFollows = user.follows;
  var postFeed = [];

  userFollows.forEach(async (u) => {
    await User.findById(u)
      .then((response) => {
        response.posts.forEach(async (p) => {
          await Post.findById(p).then((response_2) => {
            postFeed.push(response_2.id);
          });
        });
      })
      .then(() => {
        return postFeed;
      });
  });
};

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
      return u.posts;
    });

    const postIds = await Promise.all(promise_2);

    const extractedPostIds = [];

    postIds.forEach((l) => {
      l.forEach((pId) => {
        extractedPostIds.push(pId);
      });
    });

    const promise_3 = extractedPostIds.map(async (pId) => {
      const postObjects = await Post.findById(pId);
      return postObjects;
    });

    const postFeed = await Promise.all(promise_3);

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