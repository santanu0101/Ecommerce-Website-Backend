import mongoose, {Schema} from "mongoose";

const catagorySchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    }
},{timestamps: true})

export const Catagory = mongoose.model("Catagory", catagorySchema)