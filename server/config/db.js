const mongoose = require("mongoose");
const connectDb = async () => {
  try {
    mongoose.set("strictQuery", false);
    const { connection } = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database Connected : ${connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDb;
