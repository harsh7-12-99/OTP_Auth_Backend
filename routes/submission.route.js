const express = require("express");
const upload = require("../config/multer.js");
const { submitResult } = require("../controller/submission.controller.js");

const router = express.Router();

router.post("/submit", upload.single("attachment-result"), submitResult);

module.exports = router;
