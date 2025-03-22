import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import authVerify from "./auth.middlewares.js";

const adminVerify = asyncHandler((req, res, next) => {
    const admin = req.user.user_role === "admin";
    if (admin) {
        req.adminRole = req.user.userRoleAsAdmin;
        next();
    } else {
        throw new apiResponse(403, null, "Access denied");
    }
});

export default adminVerify;
