import express from "express";
import { userModel } from "../models/user_model.js";
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";
import { getDataUri } from "../utils/features.js";

//register controller
export const registerUserController = async (req, res) => {
  try {
    const { name, email, password, address, city, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password || !address || !city || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const user = await userModel.create({
      name,
      email,
      password,
      address,
      city,
      phone,
    });
    res
      .status(201)
      .json({ success: true, message: "User registered successfully", user });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: " error In User Registration", error });
  }
};

//login controller
export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    //find user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    //compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    //generate token json web token (jwt)
    const token = user.generateAuthToken();

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 10 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "User logged in successfully",
        user,
        token,
      });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({
      success: false,
      message: "Error In User Login",
      error,
    });
  }
};

//Get User Profile
export const getUserProfileController = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      user: req.user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Error In Fetching User Profile API",
      error,
    });
  }
};

//Logout User
export const logoutUserController = async (req, res) => {
  try {
    res
      .status(200)
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 10 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "User logged out successfully",
      });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({
      success: false,
      message: "Error In User Logout",
      error,
    });
  }
};

//Update User Profile
export const updateUserProfileController = async (req, res) => {
  try {
    const userId = req.user._id;

    const { name, email, password, address, city, phone } = req.body;
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Update user fields if provided, otherwise keep existing values
    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password;
    user.address = address || user.address;
    user.city = city || user.city;
    user.phone = phone || user.phone;
    // Save updated user
    await user.save();

    res.status(200).json({
      success: true,
      message: "User profile updated successfully ",
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Error In Updating User Profile",
      error,
    });
  }
};

//update user password
export const updatePasswordController = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old and new password are required",
      });
    }

    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✔ compare hashed password
    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    user.password = newPassword; // هيتعمله hash تلقائي في pre-save

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating password",
      error: error.message,
    });
  }
};

// update user profile photo
export const updateProfilePicController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const file = getDataUri(req.file);

    // delete old image لو موجودة
    if (user.profilePic && user.profilePic.public_id) {
      await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
    }

    // upload new image
    const cdb = await cloudinary.v2.uploader.upload(file.content, {
      folder: "profiles",
    });

    user.profilePic = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "profile picture updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating profile picture",
      error: error.message,
    });
  }
};
