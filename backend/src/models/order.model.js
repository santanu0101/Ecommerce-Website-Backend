import mongoose,{Schema} from "mongoose";

const orderItemSchema = new Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },

    quantity:{
        type: Number,
        default: 0
    }
})

const orderSchema = new Schema({

    orderPrice:{
        type: Number,
        required: true,
    },

    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    orderItems:[orderItemSchema],

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



