import User from '../schema/userSchema.js';
import apiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import jsonwebtoken from 'jsonwebtoken';
import jwt from "jsonwebtoken";
const { verify } = jsonwebtoken;

const authVerify = async (req, res, next) => {
  try {
    // Get token from headers or query params
    const token = 
      (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') 
        ? req.headers.authorization.split(' ')[1] 
        : null) ||
      (req.cookies && req.cookies.token) ||
      req.query.token;
    
    if (!token) {
      console.log("No token found in request");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided"
      });
    }
    
    console.log("Token received in middleware:", token.substring(0, 20) + "...");
    console.log("Using secret key:", process.env.ACCESS_TOKEN_SECRET ? "Secret exists" : "Secret missing");
    
    // Verify token using the correct secret
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    if (!decoded || !decoded._id) {
      console.log("Invalid token payload:", decoded);
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token"
      });
    }
    
    // Find user by ID
    const user = await User.findById(decoded._id);
    
    if (!user) {
      console.log("No user found for ID:", decoded._id);
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found"
      });
    }
    
    // Attach user to request
    req.user = user;
    console.log("User authenticated:", user._id);
    
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    
    if (error.name === 'JsonWebTokenError' && error.message === 'secret or public key must be provided') {
      console.error("Environment variables:", {
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET ? "exists" : "missing",
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET ? "exists" : "missing",
        NODE_ENV: process.env.NODE_ENV
      });
    }
    
    return res.status(401).json({
      success: false,
      message: "Unauthorized: " + error.message
    });
  }
};

export default authVerify;