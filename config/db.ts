import mongoose from "mongoose";

// Function to connect to the Mongodb databse
const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("DAtaBase is connected");
  });
  await mongoose.connect(`${process.env.DATABASE_URL}`)
};

export default connectDB;