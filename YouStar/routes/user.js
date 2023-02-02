const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { authenticateJWT } = require("../middleware/authenticator");

router.get("/", userController.readAll);
router.get("/:userId", userController.read);
router.get("/filter/:searchName", userController.getUsersBySeachName);
router.put("/:userId", authenticateJWT, userController.update);
router.put(
  "/follow/:followRequesterId/:userId",
  authenticateJWT,
  userController.followUser
);
router.delete("/:userId", authenticateJWT, userController.delete);
router.get("/follows/:userId", authenticateJWT, userController.getUsersFollows);
router.get("/followsCount/:userId", authenticateJWT, userController.getUsersFollowsCount);
router.get("/followerCount/:userId", authenticateJWT, userController.getUsersFollowerCount);
router.get("/postCount/:userId", authenticateJWT, userController.getUsersPostCount);
router.get("/:userId/postFeed", authenticateJWT, userController.getPostFeed);

module.exports = router;
