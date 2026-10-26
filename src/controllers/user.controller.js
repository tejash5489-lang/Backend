import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/apiError.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';


const generateAccessAndRefreshTokens=async(userId){
    try {
        await User.findById(userId)
        const accessToken = user.generateToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500,"something went wrong while generating refresh and access token")
    }
}


const registerUser = asyncHandler(async (req, res) => {
   const {fullName, email,username, password} = req.body;
//    console.log("email:",email);

   if(
    [fullName, email, username, password].some((field) => field?.trim() === ""   )
   )
   {
    throw new ApiError("All fields are required", 400);
   }   
   
   const existedUser = await User.findOne({
    $or:[{username}, {email}]
   })

   if(existedUser)
   {
    throw new ApiError(400, "User already exists");
   }

   const avatarLocalPath = req.files?.avatar[0]?.path;
//    const coverImageLocalPath = req.files?.coverImage[0]?.path;

   let coverImageLocalPath;
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){

   }


   if(!avatarLocalPath )
   {
    throw new ApiError(400 , "Avatar file is required");
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400,"Avatar file if required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refershToken")

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser,"User registered successfully")
    )

})

const loginUser= asyncHandler(async(req,res)=>{
    //req body->data
    //username and email
    //find the user
    //pswd check 
    //access and refresh
    //send cookie

    const {email,username,password}= req.body

    if(!(username || email)){
        throw new ApiError(400,"username or password is required")
    }

    const user = await User.findOne({
        $or : [{username},{email}]
    })

    if(!user){
        throw new ApiError(404,"User does not exist")
    }

    const isPasswordValid = await user.comparePassword(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)    

    const loggInUser = await User.findById(user._id).select("-password -refreshToken")

    const options ={
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken , options).cookie
    .cookie("refreshToken", refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggInUser,accessToken,refreshToken
            },
            "user logged in successfully"
        )
    )

    const logoutUser = asyncHandler(async(req,res)=>{
        User.findByIdAndUpdate(
            req.user._id,{
                $set:{
                    refershToken : undefined
                }
            },
            {
                new:true
            }
        )
    })

    const options ={
        httpOnly: true,
        secure: true
    }   

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refershToken",options)

})


export {registerUser,
    loginUser,
    loginUser,
    logoutUser

};