const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middleware/authenticator");
const upload = require("../middleware/multer");
const postController = require("../controllers/post");

router.post(
  "/",
  authenticateJWT,
  upload.single("postImage"),
  postController.create
);

router.get("/:postId/likers", postController.getPostLikers);
router.get("/", postController.readAll);
router.get("/:postId/:loggedInUserId", postController.details);
router.put("/:postId", authenticateJWT, postController.update);
router.put("/like/:postId/:likerId", authenticateJWT, postController.likePost);
router.delete("/:postId/:ownerId", authenticateJWT, postController.delete);
router.post("/:postId/:userId/postComment", postController.postComment);
router.get("/:postId/:loggedInUserId/comments", postController.getPostsComments);
router.put("/like/comment/:commentId/:likerId/:commentOwnerId", postController.likeComment);
router.delete("/comment/:commentId/:postId/delete", postController.deleteComment);

module.exports = router;