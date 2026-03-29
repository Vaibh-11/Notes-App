const express = require("express");
const router = express.Router();

const { getActivityLogs } = require("../controllers/activityLog");
const { userAuth } = require("../middleware/authentication");

router.get("/activity/:noteId", userAuth, getActivityLogs);

module.exports = router;
