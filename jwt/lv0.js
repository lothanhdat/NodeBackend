"use strict";

const JWT = require("jsonwebtoken");
const keySecret = "abcfsdf";

const token = JWT.sign({ userId: 1234, roles: ["admin"] }, keySecret, {
  expiresIn: "2 days",
});

console.log(`sign token::`, token);

JWT.verify(token, keySecret, (err, decode) => {
  console.log(`decode::`, decode);
});
