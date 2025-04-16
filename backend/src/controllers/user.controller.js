import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
// import bcrypt from "bcryptjs";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      500,
      "somthing went wrong while generating refresh and access token"
    );
  }
};

const userRegister = asyncHandler(async (req, res) => {
  const { username, email, password, fullname, phoneNumber, gender, isSeller } = req.body;
  // console.log(username)

  if (
    [username, email, password, fullname, phoneNumber, gender].some(
      (ele) => ele?.trim() === ""
    )
  ) {
    throw new apiError(400, "All fields are required");
  }

  const existUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existUser) {
    throw new apiError(409, "User with email or password already exist");
  }

  //   const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    fullname,
    phoneNumber,
    isSeller: isSeller === "true",
    gender: gender.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -wishlist"
  );

  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new apiResponse(200, createdUser, "User Register sucessfully"));
});

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!(email || password)) {
    throw new apiError(400, "email and password is required");
  }

  const user = await User.findOne({ email });

  // console.log(user)

  if (!user) {
    throw new apiError(404, "user does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  // console.log("hello",isPasswordValid)
  if (!isPasswordValid) {
    throw new apiError(401, "Invalid Password");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findOne(user._id).select(
    "-password -refreshToken -wishlist -isSeller"
  );

  // console.log(loggedInUser)
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "user logged in successfully"
      )
    );
});

const userLogout = asyncHandler(async (req, res) => {
  if (!req.user && !req.user._id) {
    throw new apiError(400, "No user Found");
  }

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged out"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword && !newPassword) {
    throw new apiError(400, "Password is required");
  }

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new apiError(400, "Invalid old Password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Password change Successfully"));
});

const changeProfile = asyncHandler(async (req, res) => {
  const { fullname, email, phoneNumber, gender } = req.body;

  if (!fullname || !email || !phoneNumber || !gender) {
    throw new apiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      fullname: fullname,
      email: email,
      phoneNumber: phoneNumber,
      gender: gender,
    },
    {
      new: true,
    }
  ).select("-password -refreshToken -wishlist");

  return res
  .status(200)
  .json(new apiResponse(200, user, "User details update successfully"));
});

export { userRegister, userLogin, userLogout, changePassword, changeProfile };
