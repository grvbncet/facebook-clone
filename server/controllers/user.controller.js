import db from "../models/index.js";
import { StatusCodes } from "../utils/statusCodes.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import RefreshToken from "../models/RefreshToken.model.js";
import { ValidationError } from "sequelize";

const User = db.User;

// Register new user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({ name, email, password });

    const accessToken = generateAccessToken({
      id: user.id,
      name: user.name,
      phone: user.phone || null,
      email: user.email,
    });
    const refreshToken = generateRefreshToken({ id: user.id });

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    await RefreshToken.create({
      userId: user.id,
      token: refreshToken,
      expiryDate,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User created successfully",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: messages,
      });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong in user controller",
    });
  }
};

// Login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //1. Validation
    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found, please register first",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    // 2. Cleanup old refresh tokens for the user
    await RefreshToken.destroy({
      where: {
        userId: user.id,
        expiryDate: { lt: new Date() },
      },
    });

    // 3. Generate tokens

    const refreshToken = await generateRefreshToken({ id: user.id });
    const accessToken = await generateAccessToken({
      id: user.id,
      name: user.name,
      phone: user.phone || null,
      email: user.email,
    });

    // 4. Store refresh token in DB
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); // valid for 7 days

    await RefreshToken.create({
      userId: user.id,
      token: refreshToken,
      expiryDate,
    });

    // 5. Set HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 6. Send response with access token
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "User logged in successfully",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone || null,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong in user controller",
    });
  }
};

// Logout

export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "No refresh token found",
      });
    }

    // Delete the refresh token from DB
    await RefreshToken.destroy({ where: { token } });

    // Clear the cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong in Looging out user controller",
    });
  }
};

// Refresh Access Token Token

export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Refresh token missing",
    });
  }

  try {
    const storedToken = await RefreshToken.findOne({ where: { token } });

    if (!storedToken || storedToken.expiryDate < new Date()) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    const payload = verifyRefreshToken(token);

    const user = await User.findByPk(payload.id);

    const accessToken = await generateAccessToken({
      id: user.id,
      name: user.name,
      phone: user.phone || null,
      email: user.email,
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Access token refreshed successfully",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone || null,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Token refresh failed",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    // req.user is set by authenticate middleware after verifying the token
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const findUser = await User.findByPk(req.user.id);
    // You can send user data directly or fetch from DB if needed
    return res.status(200).json({
      success: true,
      user: {
        id: findUser.id,
        name: findUser.name,
        email: findUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    console.log("🚀 updateProfile triggered");

    const { name, email, phone, newPassword, confirmPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    console.log("User:", user);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }

    // Handle profile update
    user.name = name;
    user.email = email;
    user.phone = phone;

    // Handle password update only if old and new password are provided
    if (newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "New password and confirm password do not match",
        });
      }
      user.password = newPassword; // Will be hashed by model hook
    }

    console.log("User updated:", user);

    await user.save();

    const refreshedUser = await User.findByPk(user.id);

    return res.status(StatusCodes.OK).json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.log("❌ Error updating user:", error.message);

    return res.status(500).json({ error: error.message });
  }
};
