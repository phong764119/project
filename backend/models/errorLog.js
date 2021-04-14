const { Schema, model } = require("mongoose");

module.exports = model(
  "ErrorLog",
  new Schema(
    {
      url: String,
      method: String,
      message: String,
      stack: String,
    },
    { timestamps: true }
  )
);
