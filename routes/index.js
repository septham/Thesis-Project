const express = require("express"),
  router = express.Router(),
  DataRouter = require("./data");

router.route("/").get((req, res) => {
  res.render("index"); //show view index.ejs
});

router.use("/data", DataRouter);

module.exports = router;
