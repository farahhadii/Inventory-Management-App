const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const sendEmail = require("../utils/sendEmail");

/**
 * Generates a JWT token for a given user ID.
 * @param {String} id - User ID
 * @returns {String} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

/**
 * Sets a JWT token in an HTTP-only cookie.
 * @param {Object} res  
 * @param {String} token 
 */
const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });
};

/**
 * Sends a standardized user response.
 * @param {Object} res 
 * @param {Number} statusCode 
 * @param {Object} user 
 * @param {String} token 
 */

const sendUserResponse = (res, statusCode, user, token) => {
  const { _id, name, email, photo, phone, bio } = user;
  res.status(statusCode).json({
    _id,
    name,
    email,
    photo,
    phone,
    bio,
    token,
  });
};

const registerUser = asyncHandler(async (req, res) => {

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters long");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email has already been registered");
  }

  // Create user
  const user = await User.create({ name, email, password });

  if (!user) {
    res.status(400);
    throw new Error("Invalid user data");
  }

  // Generate token and set cookie
  const token = generateToken(user._id);
  setTokenCookie(res, token);
  sendUserResponse(res, 201, user, token);
});


const loginUser = asyncHandler(async (req, res) => {

  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide both email and password");
  }

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found, please sign up");
  }

  // Validate password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  // Generate token and set cookie
  const token = generateToken(user._id);
  setTokenCookie(res, token);
  sendUserResponse(res, 200, user, token);
});

const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  res.status(200).json({ message: "Successfully logged out" });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json(false);

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.json(true);
  } catch (error) {
    return res.json(false);
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { name, phone, bio, photo } = req.body;

  user.name = name || user.name;
  user.phone = phone || user.phone;
  user.bio = bio || user.bio;
  user.photo = photo || user.photo;

  const updatedUser = await user.save();
  sendUserResponse(res, 200, updatedUser, generateToken(updatedUser._id));
});

const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { oldPassword, password } = req.body;

  if (!user) {
    res.status(400);
    throw new Error("User not found, please sign up");
  }

  if (!oldPassword || !password) {
    res.status(400);
    throw new Error("Please add old and new password");
  }

  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);
  if (!passwordIsCorrect) {
    res.status(400);
    throw new Error("Old password is incorrect");
  }

  user.password = password;
  await user.save();

  res.status(200).json({ message: "Password change successful" });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }

  const sendTo = user.email.trim();
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sendTo);
  if (!isValidEmail) {
    res.status(400);
    throw new Error("Invalid recipient email address");
  }

  // Delete old token if it exists
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  const resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // Save token to database
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * 60 * 1000, 
  }).save();

  // Construct the reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
  const message = `
    <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6;">
      <h2>Hello ${user.name}</h2>
      <p>Please use the URL below to reset your password:</p>
      <p>This link is valid for <strong>30 minutes</strong>.</p>
      <a href="${resetUrl}" style="color: #2D89EF; text-decoration: none;">${resetUrl}</a>
      <p>Regards,</p>
      <p><strong>Inventory Management Team</strong></p>
    </div>
  `;

  const subject = "Password Reset Request";
  const sentFrom = process.env.EMAIL_USER;

  try {
    await sendEmail(sentFrom, sendTo, sentFrom, subject, message);
    res.status(200).json({ success: true, message: "Reset Email Sent" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500);
    throw new Error("Email not sent, please try again");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or expired token");
  }

  const user = await User.findById(userToken.userId);
  user.password = password;
  await user.save();

  res.status(200).json({ message: "Password Reset Successful, Please Login" });
});

module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
};