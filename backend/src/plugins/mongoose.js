const mongoose = require("mongoose");

exports.connectToDB = async function (uri) {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("New Connection Established to MongoDB");
    return true;
  } catch (error) {
    console.log("Failed to Establish Connection to MongoDB", error);
    return false;
  }
};
