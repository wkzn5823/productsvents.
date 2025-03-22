const express = require("express");
const router = express.Router();
const { obtenerLogs } = require("../controllers/logsController");

router.get("/", obtenerLogs);

module.exports = router;
