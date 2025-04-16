import mongoose,{Schema} from "mongoose";
import { itemSchema } from "./items.model.js";


const orderSchema = new Schema({

    orderPrice:{
        type: Number,
        required: true,
    },

    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    orderItems:[itemSchema],

    address:{
        type:String,
        required: true
    },

    status:{
        type: String,
        enum:["PENDING", "CANCELED", "DELEVERED"],
        default: "PENDING"
    }
}, {timestamps: true})

export const Order = mongoose.model("Order", orderSchema)



