import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { BlacklistToken } from "../models/blacklistToken.model.js";     

export const authUser = asyncHandler(async (req , res , next) => {
    try {
        // req.header  used to fetch cookis feom mobile
        // console.log("Cookies : ", req.cookies);
        // console.log("Headers : ", req.headers);
        const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];
        // const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "")

        // console.log("Token : ", token);

        if(!token){
            throw new ApiError(401 , "Unauthorized Request")
        }
    
        const blacklistedToken = await BlacklistToken.findOne({token});    
        if(blacklistedToken) {
            throw new ApiError(401 , "Unauthorized Request Blacklisted Token")
        }
        // decodeToke have _id which we have provided in generateAccessToken in user.model
        const decodedToken = jwt.verify(token , process.env.JWT_SECRET);

        const user = await User.findById(decodedToken?._id);
    
        if(!user) {
            throw new ApiError(401 , "Invalid Access Token");
        }
    
        req.user = user;
        next();
    } catch (error) {
        console.log("error in auth.js middleware ");
        
        throw new ApiError(401 , error?.message || "Invalid Access Token")
    }
});


