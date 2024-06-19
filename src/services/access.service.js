"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response");

// service ///
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  /**
   * check token used
   */
  static handlerRefreshTokenV2 = async ({keyStore, user, refreshToken}) => {
    const {userId, email} = user;
    if(keyStore.refreshTokensUsed.includes(refreshToken)){
      // delete all key of that user
      await KeyTokenService.deleteKeyByUserId(userId);
      throw new ForbiddenError('Something wrong happened, please login again');
    }

    if(keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Refresh token not found, shop may not registered');

    // check userId
    const foundShop = await findByEmail({email});
    if (!foundShop) throw new AuthFailureError('Shop not found');

    //create new token pair
    const tokens = await createTokenPair({userId,email}, keyStore.publicKey, keyStore.privateKey);

    // update refresh token used
    await keyStore.updateOne({
      $set:{
        refreshToken:tokens.refreshToken
      },
      $addToSet:{
        refreshTokensUsed:refreshToken
      }
    })

    return {
      user,
      tokens
    }

  };

  static handlerRefreshToken = async (refreshToken) => {
    // check if token is used
    console.log('handlerRefreshToken activate with refresh token: ',refreshToken)
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
    console.log('foundedTokenUsed',foundToken)

    //if yes
    if(foundToken){
      // decode to see who user is it
      const {userId,email} = await verifyJWT(refreshToken, foundToken.privateKey);
      console.log("decode to see who user is: ",{userId,email})

      // delete all key of that user
      await KeyTokenService.deleteKeyByUserId(userId);
      throw new ForbiddenError('Something wrong happened, please login again');
    }

    // if the token is not used
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError('Refresh token not found, shop may not registered');

    //verify token
    const {userId,email} = await verifyJWT(refreshToken, holderToken.privateKey);
    console.log('verified token-----',{userId,email})

    // check userId
    const foundShop = await findByEmail({email});
    if (!foundShop) throw new AuthFailureError('Shop not found');

    //create new token pair
    const tokens = await createTokenPair({userId,email}, holderToken.publicKey, holderToken.privateKey);

    // update refresh token used
    await holderToken.updateOne({
      $set:{
        refreshToken:tokens.refreshToken
      },
      $addToSet:{
        refreshTokensUsed:refreshToken
      }
    })

    return {
      user: {userId,email},
      tokens
    }

  };

  static logout = async (keyStore) => {
    // console.log("keyStore--------------------", keyStore);
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  };

  /*
    Login step
    1- check email in dbs
    2- match password
    3- create AT vs RT and save
    4- generate tokens
    5- get data return login
   */
  static login = async ({ email, password, refreshToken = null }) => {
    // nhờ frontend gửi kèm cookie để xác thực refresh token => không cần truy cập vào DB nữa => nhanh hơn
    // check email in dbs
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Error: shop not registered");

    // match password
    const match = bcrypt.compareSync(password, foundShop.password);
    if (!match) throw new AuthFailureError("Password not match");

    // create token pair
    // create privateKey, publicKey
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    //generate token
    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId,
    });

    // return data
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };
  static signUp = async ({ name, email, password }) => {
    // step1: check email exists

    // return modelShop javascript object
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: shop already registered");
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    if (newShop) {
      // created privatekey, publicKey
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });

      const publicKey = crypto.randomBytes(64).toString("hex");
      const privateKey = crypto.randomBytes(64).toString("hex");

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });
      if (!keyStore) {
        return {
          code: "xxxx",
          message: "keyStore error",
        };
      }

      // create token pair
      const tokens = await createTokenPair(
        {
          userId: newShop._id,
          email,
        },
        publicKey,
        privateKey
      );

      return {
        code: 201,
        metadata: {
          // shop: newShop,
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      matadata: null,
    };
  };
}

module.exports = AccessService;
