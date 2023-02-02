const express = require("express");
const router = express.Router();
const companyController = require("../controllers/company");
const { authenticateJWT } = require("../middleware/authenticator");

router.post("/", authenticateJWT, companyController.create);
router.get("/", companyController.readAll);
router.get("/:companyId", companyController.read);
router.put("/:companyId", authenticateJWT, companyController.update);
router.delete("/:companyId", authenticateJWT, companyController.delete);

module.exports = router;
