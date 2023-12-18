"use strict";

//count connect
const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECONDS = 5000;
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log("number of connection ", numConnection);
};

//check over load
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    // example maximum number of connections based on number of cores
    const maxConnections = numCores * 5; // max Connections will vary depend on CPU, RAM
    console.log(`active connections: ${numConnection}`);
    console.log(`memory usage: ${memoryUsage / 1024 / 1024} MB`);
    if (numConnection > maxConnections * 0.8) {
      // 80% of max connection
      console.log("connection overload detected");
    }
  }, _SECONDS); // monitor every _SECONDS seconds
};

module.exports = { countConnect, checkOverload };
