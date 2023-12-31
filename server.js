const app = require("./src/app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3056;

const server = app.listen(PORT, () => {
  console.log("Your project start with port: ", PORT);
});

process.on("SIGINT", () => {
  server.close(() => console.log(`exit server express`));
  mongoose.disconnect();
  //   notify.send(ping....);
});
