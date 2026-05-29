const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    
    // Handle specific Mongoose/MongoDB errors
    if (error.name === "MongoNetworkError") {
      console.error("❌ Network Error: Unable to reach MongoDB. Check your internet or Atlas IP whitelist.");
    } else if (error.name === "MongoServerSelectionError") {
      console.error("❌ Server Selection Error: Could not connect to any MongoDB server. Check your MONGO_URI.");
    } else if (error.name === "MongoParseError") {
      console.error("❌ Parse Error: Invalid MongoDB connection string in MONGO_URI.");
    } else if (error.code === 8000 || error.codeName === "AtlasError") {
      console.error("❌ Atlas Auth Error: Bad credentials. Check your username/password in MONGO_URI.");
    } else if (error.code === 18) {
      console.error("❌ Authentication Failed: Wrong username or password.");
    } else if (error.code === "ENOTFOUND") {
      console.error("❌ DNS Error: MongoDB host not found. Check your cluster URL.");
    } else {
      console.error(`❌ Unknown DB Error: ${error.message}`);
    }

    process.exit(1); // Stop the server if DB connection fails
  }
};

// Handle connection events after initial connect
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB Disconnected!");
});

mongoose.connection.on("reconnected", () => {
  console.log("🔄 MongoDB Reconnected!");
});

mongoose.connection.on("error", (error) => {
  console.error(`❌ MongoDB Runtime Error: ${error.message}`);
});

module.exports = connectDB;