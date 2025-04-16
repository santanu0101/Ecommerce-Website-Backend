import mongoose, { Schema } from "mongoose";

export const itemSchema  = new Schema({
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },

    quantity:{
        type: Number,
        default: 0
    }

})

