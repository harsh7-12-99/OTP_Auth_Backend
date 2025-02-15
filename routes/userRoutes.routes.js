const express = require("express");
const router = express.Router();
const dataController = require("../controller/data.controller");

router.get("/get-user/", dataController.getUserController);
router.post("/add-user/", dataController.addUserController);

module.exports = router;
