"use strict";

const { OK, CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");
class AccessController {
  handleRefreshToken = async (req, res, next) => {
    console.log(`req.keyStore--------`, req.keyStore);
    new SuccessResponse({
      message: "Get token success !",
      // v1: ----- metadata: await AccessService.handlerRefreshToken(req.body.refreshToken), 
      metadata: await AccessService.handlerRefreshTokenV2({
        refreshToken: req.refreshToken,
        keyStore: req.keyStore,
        user:req.user
      }), 
    }).send(res);
  };
  
  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  logout = async (req, res, next) => {
    console.log(`req.keyStore--------`, req.keyStore);
    new SuccessResponse({
      message: "Logout success !",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    new CREATED({
      message: "Registered OK !",
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };
}
module.exports = new AccessController();
