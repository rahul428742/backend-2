import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/fileUpload.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { upload } from "../middlewares/multer.middleware.js";
const registerUser = asyncHandler(async (req, res, next) => {
    // res.status(200).json({
    //     success: true,
    //     message: "ok"
    // });

    // get user details from frontend
    // validation - not empty
    // check if user already exists
    // check for images, check for avatar
    // upload then cloudinary, avatar
    // create user object - create entry in db.
    // remove password and refresh token from response.
    // check for user creation
    // return res 

    // -----------------------------------------------------------
    // get user details from frontend
    const {fullname, email, username, password} = req.body
    console.log("email : ", email);

    // validation - not empty


    // if (fullname === "") {
    //     throw  new ApiError(400, "FullName Is Required.");
    // }

    if ([fullname, email, password, username].some((field) => field?.trim === "")){
        throw new ApiError(400, "All Fields Are Required.")
    }

    // check if user already exists
    const existsUser =  await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existsUser) {
        throw new ApiError(409, "User With Email, or UserNAme Already exists.")
        
    }
    
    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const CoverImageLocalPath = req.files?.CoverImage[0]?.path;
    
    let CoverImageLocalPath;
    if (req.files && Array.isArray(req.files.CoverImage) && req.files.CoverImage.length > 0) {
        CoverImageLocalPath = req.files.CoverImage[0].path;
    }
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar File is Required.");
    }
    

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const CoverImage = await uploadOnCloudinary(CoverImageLocalPath);

    if(!avatar){
        throw new ApiError(400, "Avatar File is Required.");
    }

    // create user object - create entry in db.

    const user = await User.create({
        fullname,
        avatar : avatar.url,
        CoverImage : CoverImage?.url || "",
        email,
        password,
        username : username.toLowerCase()
    });

    // remove password and refresh token from response.

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // check for user creation
    // return res 

    if (!createdUser){
        throw new ApiError(500, "Something went Wrong While registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    );
});


export { registerUser };
