import mongoose, { Schema } from "mongoose";

const sellerSchema = new Schema({
  sellerId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    require: [true, "Password is required"],
  },

  fullname: {
    type: String,
    required: true,
    trim: true,
  },

  phoneNumber:{
    type: Number,
    required: true
  },

  Gender:{
    type: String,
    enum: ["male", "female"]
  },

  refreshToken:{
    type:String
  }

},{timestamps: true});

export const Seller = mongoose.model("Seller", sellerSchema);
