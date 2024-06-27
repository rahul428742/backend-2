import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/fileUpload.js";
import fs from "fs";

const registerUser = asyncHandler(async (req, res, next) => {
    // Extract user details from the request body
    const { fullname, email, username, password } = req.body;
    console.log("email : ", email);

    // Check if any required fields are empty
    if ([fullname, email, password, username].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All Fields Are Required.");
    }

    // Get the path of the avatar image from the request files
    const avatarLocalPath = req.files?.avatar[0]?.path;

    // Check if the avatar file is present
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar File is Required.");
    }

    // Get the path of the cover image from the request files (if provided)
    let CoverImageLocalPath;
    if (req.files && Array.isArray(req.files.CoverImage) && req.files.CoverImage.length > 0) {
        CoverImageLocalPath = req.files.CoverImage[0].path;
    }

    // Check if a user with the given email or username already exists
    const existsUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    // If the user already exists, delete the uploaded images and throw an error
    if (existsUser) {
        fs.unlinkSync(avatarLocalPath);

        if (CoverImageLocalPath) {
            fs.unlinkSync(CoverImageLocalPath);
        }
        throw new ApiError(409, "User With Email or Username Already Exists.");
    }

    // Upload the avatar image to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    // Upload the cover image to Cloudinary (if provided)
    const CoverImage = await uploadOnCloudinary(CoverImageLocalPath);

    // Check if the avatar upload was successful
    if (!avatar) {
        throw new ApiError(400, "Avatar File is Required.");
    }

    // Create a new user in the database with the provided details and uploaded images
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        CoverImage: CoverImage.url,
        email,
        password,
        username: username.toLowerCase()
    });

    // Find the created user and exclude the password and refreshToken from the result
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    // Check if the user was created successfully
    if (!createdUser) {
        throw new ApiError(500, "Something went Wrong While Registering the User.");
    }

    // Return the created user in the response with a success message
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully"));
});

export { registerUser };