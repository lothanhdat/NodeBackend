"use strict";

const express = require("express");
const router = express.Router();

router.use("/v1/api", require("./access"));

router.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "welcome to homepage",
  });
});

module.exports = router;