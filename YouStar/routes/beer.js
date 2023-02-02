const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middleware/authenticator");
const upload = require("../middleware/multer");
const beerController = require("../controllers/beer");

router.post(
  "/",
  authenticateJWT,
  upload.single("beerImage"),
  beerController.create
);
router.get("/", beerController.readAll);
router.get("/:beerId", beerController.read);
router.put("/:beerId", authenticateJWT, beerController.update);
router.delete("/:beerId", authenticateJWT, beerController.delete);
router.get("/filter/:companyFilterName", beerController.filterByCompany);

module.exports = router;
