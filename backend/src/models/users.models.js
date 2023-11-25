const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    role: {
      type: Number,
    },
    resources: {
      type: String,
    },
    accessTokenCreatedAt: {
      type: String,
    },
    userCreatedAt: {
      type: String,
    },
  },
  { collection: "Users" }
);

module.exports = mongoose.model("Users", userSchema);
