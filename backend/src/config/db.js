import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/ecommerce`);
    console.log("MongoDB connected SuccessFully");
  } catch (error) {
    console.log(`mongodb connection error ${error}`);
    process.exit(1);
  }
};

export default connectDb;
