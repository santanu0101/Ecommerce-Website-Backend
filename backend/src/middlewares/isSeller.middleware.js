import { apiError } from "../utils/apiError.js";

const isSellerCheck = async(req, res, next)=>{
    if(req.user && req.user.isSeller){
        next()
    }
    else {
        // res.status(403).json({ message: "Admin access only" });
        throw new apiError(403, "Seller access only")
      }
}

export { isSellerCheck }