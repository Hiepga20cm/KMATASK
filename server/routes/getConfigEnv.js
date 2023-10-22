const express = require("express");
const { getConfig } = require("../controllers/groupChat.controller");
const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();

router.get(
    "/getConfig",
    requireAuth,
    getConfig
    
);

module.exports = router;
