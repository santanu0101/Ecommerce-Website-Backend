import mongoose, { Schema } from "mongoose";
import { itemSchema } from "./items.model.js";

const cartSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: [itemSchema],
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);
