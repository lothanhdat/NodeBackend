"use string";
const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");

//services
const { findByUserId } = require("../services/keyToken.service");
const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: 'x-rtoken-id'
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    //access token

    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
      // algorithm: "RS256",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
      // algorithm: "RS256",
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify::`, err);
      } else {
        console.log(`decode verify::`, decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  // 1- check if userid is missing ?
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Missing userId");

  // 2- get access token
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("key not found");

  // 3- verify Token
  // 4- Check user in DBs?
  // 5- check keyStore with this userId
  // 6- return next()
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Missing accessToken");

  try {
    const decodeUser = await JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid userId");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const authenticationV2 = asyncHandler(async (req, res, next) => {
  // 1- check if userid is missing ?
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Missing userId");

  // 2- get access token
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("key not found");

  // 3- verify Token
  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      const decodeUser = await JWT.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId) throw new AuthFailureError("Invalid userId");
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  // 4- Check user in DBs?
  // 5- check keyStore with this userId
  // 6- return next()
  const refreshToken = req.headers[HEADER.AUTHORIZATION];
  if (!refreshToken) throw new AuthFailureError("Missing refresh token");

  try {
    const decodeUser = await JWT.verify(refreshToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid userId");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async(token,keySecret) => {
  return await JWT.verify(token,keySecret);
}
module.exports = {
  createTokenPair,
  authentication,
  authenticationV2,
  verifyJWT,
};
