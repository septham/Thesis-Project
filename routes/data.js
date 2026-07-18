const express = require("express");
const router = express.Router();
const DataController = require("../controllers/data");

router.post("/", DataController.insert);

router.get("/predict", DataController.predict);

module.exports = router;
