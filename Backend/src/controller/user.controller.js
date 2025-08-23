
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const userRegister = asyncHandler(async(req , res)=>{
    try{
        const { fullName, email, password, confirmPassword } = req.body;
        if(!fullName || !email || !password || !confirmPassword){
            return res.status(400).json(new ApiError(400 , 'Please fill in all fields'));
        }
        
        for(let i=0 ; i<password.length ; i++){
            if(password[i] === ' '){
                return res.status(400).json(new ApiError(400 , 'Password should not contain spaces'));
            }
        }
        let addrade = false;
        for(let i = 0 ; i <email.length ; i++){
            if(email[i] === ' '){
                return res.status(400).json(new ApiError(400 , 'Email should not contain spaces'));
            }
            if(email[i] === '@'){
                addrade = true;
            }
        }
        if(!addrade){
            return res.status(400).json(new ApiError(400 , 'Email should contain @'));
        }
        
        const existingUser = await User.findOne({
            $or: [{ email }],
        });
        
        if (existingUser) {
            return res.status(409).json(new ApiError(409, 'User already exists'));
        }

        const user = await User.create({
            fullName,
            email,
            password
        });

        if(!user){
            return res.status(500).json(new ApiError(500 , 'Something went wrong while Registring'));
        }

        const token = user.generateAuthToken();

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true, // cannot be accessed by JS
            secure: process.env.NODE_ENV === 'production', // only https in prod
            sameSite: 'strict', 
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(201).json(new ApiResponse(201, {
            user,
            token
        }, "User Registered Successfully"));
    }catch(error){
        console.log("❤️❤️🎶");
        console.log(error);
        return res.status(500).json(new ApiError(500 , 'Internal Server Error'));
    }
    

});
const userLogin = asyncHandler(async(req , res)=>{

});
const getUser = asyncHandler(async(req , res)=>{

});
const forgetPassword = asyncHandler(async(req , res)=>{

});



export {
    userRegister,
    // userLogin,
    // getUser,
    // forgetPassword
}