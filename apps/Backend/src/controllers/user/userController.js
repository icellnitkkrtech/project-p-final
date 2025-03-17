import asyncHandler from "../../utils/asyncHandler.js";
import UserService from "../../services/userServices.js";
import apiResponse from "../../utils/apiResponse.js";

export default class UserController {
  constructor() {
    this.userService = new UserService();
  }

  register = asyncHandler(async (req, res) => {
    const result = await this.userService.registerUser(req.body);

    if (result.statusCode === 201) {
      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      };

      res
        .status(result.statusCode)
        .cookie("authToken", result.data.authToken, options)
        .cookie("refreshToken", result.data.refreshToken, options)
        .json(result);
    } else {
      res.status(result.statusCode).json(result);
    }
  });

  verifyEmailByToken = asyncHandler(async (req, res) => {
    const { token } = req.body;
    const result = await this.userService.verifyEmailByToken(token);
    res.status(result.statusCode).json(result);
  });

  login = asyncHandler(async (req, res) => {
    const result = await this.userService.loginUser(req.body);

    if (result.statusCode === 200) {
      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      };

      res
        .status(result.statusCode)
        .cookie("authToken", result.data.authToken, options)
        .cookie("refreshToken", result.data.refreshToken, options)
        .json(result);
    } else {
      res.status(result.statusCode).json(result);
    }
  });

  logout = asyncHandler(async (req, res) => {
    try {
      // Clear cookies
      res.clearCookie('authToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });
      
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });

      return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Error during logout'
      });
    }
  });

  refreshToken = asyncHandler(async (req, res) => {
    const result = await this.userService.refreshToken(req.body.refreshToken);
    res.status(result.statusCode).json(result);
  });

  getCurrentUser = asyncHandler(async (req, res) => {
    const result = await this.userService.getCurrentUser(req.user._id);
    res.status(result.statusCode).json(result);
  });

  forgotPassword = asyncHandler(async (req, res) => {
    const result = await this.userService.forgotPassword(req.body.email);
    res.status(result.statusCode).json(result);
  });

  resetPassword = asyncHandler(async (req, res) => {
    const { resetToken, newPassword } = req.body;
    const result = await this.userService.resetPassword(
      resetToken,
      newPassword
    );
    res.status(result.statusCode).json(result);
  });

  updateProfile = asyncHandler(async (req, res) => {
    const result = await this.userService.updateProfile(req.user._id, req.body);
    res.status(result.statusCode).json(result);
  });

  verifyEmail = asyncHandler(async (req, res) => {
    const result = await this.userService.verifyEmail(req.user._id);
    res.status(result.statusCode).json(result);
  });
}
