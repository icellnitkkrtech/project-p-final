import User from '../schema/userSchema.js';
import apiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import jsonwebtoken from 'jsonwebtoken';
const { verify } = jsonwebtoken;

const authVerify = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.authToken || req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json(new apiResponse(401, null, "Unauthorized request"));
    }

    const decodedToken = verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
    if (!user) {
      return res.status(401).json(new apiResponse(401, null, "Invalid token"));
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Error:", error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json(new apiResponse(401, null, "Token expired"));
    }
    return res.status(401).json(new apiResponse(401, null, "Invalid token"));
  }
});

export default authVerify;