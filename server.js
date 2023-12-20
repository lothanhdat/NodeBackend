const app = require("./src/app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3055;

const server = app.listen(3055, () => {
  console.log("Your project start with port ", PORT);
});

process.on("SIGINT", () => {
  server.close(() => console.log(`exit server express`));
  // mongoose.disconnect();
  //   notify.send(ping...);
});
