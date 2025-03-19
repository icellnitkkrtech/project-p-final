import User from "../schema/userSchema.js";
import ApiResponse from "../utils/apiResponse.js";
import bcrypt from 'bcrypt';
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";

export default class userModel {
    user = User;
    async createUser(userData) {
        try {
            const newUser = await this.user.create({
                email: userData.email,
                password: userData.password,
                user_role: userData.user_role,
                admin: userData.admin,
            });
            newUser.password = undefined; // Don't return password in response
            return new ApiResponse(201, newUser, "User created successfully");
        } catch (error) {
            // console.error("Error creating user:", error);
            if (error.code === 11000) { // MongoDB duplicate key error
                return new ApiResponse(409, null, "Email already exists");
            }
            return new ApiResponse(500, null, "An error occurred while creating user");
        }
    }
    async verifyEmailByToken(token) {
        try {
            const user = await this.user.findOne({
                verificationToken: token,
                verificationTokenExpiry: { $gt: Date.now() }
            });

            if (!user) {
                return new ApiResponse(400, null, "Invalid or expired token");
            }

            user.isVerified = true;
            user.verificationToken = undefined;
            user.verificationTokenExpiry = undefined;
            await user.save();

            return new ApiResponse(200, null, "Email verified successfully");
        } catch (error) {
            return new ApiResponse(500, null, "An error occurred while verifying email");
        }
    }

    async findUserByEmail(email) {
        try {
            const user = await this.user.findOne({ email }).select("+password");
            if (!user) {
                return new ApiResponse(404, null, "User not found");
            }
            return new ApiResponse(200, user, "User found successfully");
        } catch (error) {
            return new ApiResponse(500, null, "An error occurred while finding user");
        }
    }

    async findUserById(userId) {
        try {
            const user = await this.user.findById(userId)
                .populate('Student')
                .populate('Company');
            if (!user) {
                return new ApiResponse(404, null, "User not found");
            }
            return new ApiResponse(200, user, "User found successfully");
        } catch (error) {
            return new ApiResponse(500, null, "An error occurred while finding user");
        }
    }

    async updateUser(userId, updateData) {
        try {
            // Prevent updating sensitive fields directly
            delete updateData.password;
            delete updateData.email;
            delete updateData.user_role;

            const updatedUser = await this.user.findByIdAndUpdate(
                userId,
                updateData,
                { new: true, runValidators: true }
            );

            if (!updatedUser) {
                return new ApiResponse(404, null, "User not found");
            }

            return new ApiResponse(200, updatedUser, "User updated successfully");
        } catch (error) {
            return new ApiResponse(500, null, "An error occurred while updating user");
        }
    }

    async updatePassword(userId, newPassword) {
        try {
            const salt = await bcrypt.genSalt(10); // Reduced salt rounds for performance
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            const updatedUser = await this.user.findByIdAndUpdate(
                userId,
                {
                    password: hashedPassword,
                    authToken: "",
                    refreshToken: ""
                },
                { new: true }
            );

            if (!updatedUser) {
                return new ApiResponse(404, null, "User not found");
            }

            return new ApiResponse(200, null, "Password updated successfully");
        } catch (error) {
            return new ApiResponse(500, null, "An error occurred while updating password");
        }
    }

    async updateTokens(userId, authToken, refreshToken) {
        try {
            const updatedUser = await this.user.findByIdAndUpdate(
                userId,
                {
                    authToken,
                    refreshToken,
                    lastLogin: new Date()
                },
                { new: true }
            );

            if (!updatedUser) {
                return new ApiResponse(404, null, "User not found");
            }

            return new ApiResponse(200, updatedUser, "Tokens updated successfully");
        } catch (error) {
            return new ApiResponse(500, null, "An error occurred while updating tokens");
        }
    }

    async clearTokens(userId) {
        try {
            const updatedUser = await this.user.findByIdAndUpdate(
                userId,
                {
                    authToken: "",
                    refreshToken: ""
                },
                { new: true }
            );

            if (!updatedUser) {
                return new ApiResponse(404, null, "User not found");
            }

            return new ApiResponse(200, null, "Logged out successfully");
        } catch (error) {
            return new ApiResponse(500, null, "An error occurred while logging out");
        }
    }

    async verifyEmail(userId) {
        try {
            const updatedUser = await this.user.findByIdAndUpdate(
                userId,
                { isVerified: true },
                { new: true }
            );

            if (!updatedUser) {
                return new ApiResponse(404, null, "User not found");
            }

            return new ApiResponse(200, null, "Email verified successfully");
        } catch (error) {
            return new ApiResponse(500, null, "An error occurred while verifying email");
        }
    }

    async deleteUser(userId) {
        try {
            const deletedUser = await this.user.findByIdAndDelete(userId);
            if (!deletedUser) {
                return new ApiResponse(404, null, "User not found");
            }

            return new ApiResponse(200, null, "User deleted successfully");
        } catch (error) {
            return new ApiResponse(500, null, "An error occurred while deleting user");
        }
    }
    //to get all  pcc userRoleAsAdmin: { type: String, enum: ['owner', 'admin', 'pcc', 'superadmin', 'none'], required: false },
    async getPCC() {    
        try {
           
            const user = await this.user.find({ userRoleAsAdmin: 'pcc' });
           
           if (!user) {
                return new ApiResponse(404, null, "PCC not found");
            }
            return new ApiResponse(200, user, "PCCs found successfully");
        } catch (error) {
            return new ApiResponse(500, null, "An error occurred while finding PCCs");
        }
    }
       
    
    promoteAdmin = asyncHandler(async (userId, userRoleAsAdmin) => {
        const updatedUser = await this.user.findByIdAndUpdate(
            userId,
            { userRoleAsAdmin },
            { new: true }
        );
        if (!updatedUser) {
            return new ApiResponse(404, null, "User not found");
        }
        return new ApiResponse(200, updatedUser, "User promoted to admin successfully");
    });


    demoteAdmin = asyncHandler(async (userId) => {
        const updatedUser = await this.user.findByIdAndUpdate(
            userId,
            { userRoleAsAdmin: 'none' },
            { new: true }
        );
        if (!updatedUser) {
            return new ApiResponse(404, null, "User not found");
        }
        return new ApiResponse(200, updatedUser, "User demoted from admin successfully");
    });

    verifyandLockUser = asyncHandler(async (userId, adminId) => {
        const updatedUser = await this.user.findByIdAndUpdate(
            userId,
            { isVerified: true, profileStatus: 'locked', verifiedBy: adminId },
            { new: true }
        );

        if (!updatedUser) {
            return new ApiResponse(404, null, "User not found");
        }

        return new ApiResponse(200, updatedUser, "User verified successfully");
    });

    unlockUserProfile = asyncHandler(async (userId, adminId) => {
        const updatedUser = await this.user.findByIdAndUpdate(
            userId,
            { profileStatus: 'unlocked', unlockedBy: adminId },
            { new: true }
        )
        if (!updatedUser) {
            return new apiResponse(404, null, "User Not found");
        }
        return new apiResponse(200, updatedUser, "User profile Unlocked");
    })

    
}