"use strict";

// !mdbg
const { model, Schema, Types } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Apikey";
const COLLECTION_NAME = "Apikeys";

// Declare the Schema of the Mongo model
var ApikeySchema = new Schema(
  {
    key: {
      type: String,
      trim: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      enum: ["0000", "1111", "2222"],
      require: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, ApikeySchema);
