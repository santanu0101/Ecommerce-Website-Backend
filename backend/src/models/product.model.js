import mongoose,{mongo, Schema} from "mongoose"


const productSchema = new Schema({
    description:{
        type: String,
        required: true,
        maxlength: [1500, "Description max length should be 1500 charecters"],
        minlength: [10, "Description min length should be 10 charecters"]
    },

    name: {
        type: String,
        required: true
    },

    productImage:{
        type: String,
        required: true
    },

    price:{
        type: Number,
        default: 0
    },

    stock:{
        type:Number,
        default:0
    },

    catagory:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Catagory",
        required: true
    },

    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller"
    }
},{timestamps: true})

export const Product = mongoose.model("Product", productSchema)