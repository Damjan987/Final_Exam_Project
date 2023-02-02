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
// TODO read all posts (Don't probably need this)
// for testing purposes this is OK for now
router.get("/", postController.readAll);
router.get("/:postId", postController.details);
router.put("/:postId", authenticateJWT, postController.update);
router.delete("/:postId", authenticateJWT, postController.delete);

module.exports = router;