"use strict";

const { OK, CREATED } = require("../core/success.response");
const accessService = require("../services/access.service");
class AccessController {
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Registered OK !",
      metadata: await accessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };
}
module.exports = new AccessController();
