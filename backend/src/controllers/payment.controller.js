import { asyncHandler } from "../utils/asyncHandler.js";

const createPayment = asyncHandler(async(req, res)=>{
    console.log("payment Under Construction")
})

export {createPayment}