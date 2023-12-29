"use strict";

const JWT = require("jsonwebtoken");
const crypto = require("node:crypto");

const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 4096,
});

console.log({ privateKey, publicKey });

const token = JWT.sign({ userId: 1234, roles: ["admin"] }, privateKey, {
  expiresIn: "2 days",
  algorithm: "RS256",
});

console.log(`sign token::`, token);

JWT.verify(token, publicKey, (err, decode) => {
  console.log(`decode::`, decode);
});
