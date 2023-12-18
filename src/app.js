const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();

//init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

//init db
require("./dbs/init.mongodb");
const { checkOverload } = require("./helpers/check.connect");
checkOverload();

//init routes
app.get("/", (req, res, next) => {
  const strCompress = "str Compress const";
  return res.status(200).json({
    message: "welcome to homepage",
    metadata: strCompress.repeat(100000),
  });
});

//handling error

module.exports = app;
