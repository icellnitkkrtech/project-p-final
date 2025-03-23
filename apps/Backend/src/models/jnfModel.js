import JNF from "../schema/company/jnfSchema.js";
import User from "../schema/userSchema.js";
import apiResponse from "../utils/apiResponse.js";

//jnfmodel
export default class JNFModel {
    jnf = JNF;
    user = User;
    async getAllJnfs() {
        try {
            const jnfs = await this.jnf
                .find()
                .populate('submittedBy', 'name email');
            return new apiResponse(200, jnfs, "jnfs fetched successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }
    async getJNFById(jnfId) {
        try {
            const jnf = await this.jnf
                .findById(jnfId)
                .populate('submittedBy', 'name email');
            return new apiResponse(200, jnf, "jnf fetched successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }

    async createJnf(jnfData) {
        try {
            console.log(jnfData);
            const newJnf = await this.jnf.create(jnfData);
            console.log("New JNF created:", newJnf);
            return new apiResponse(200, jnfData, "jnf created successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }
    async updateJnf(jnfId, jnfData) {

        try {
            // Ensure status is set to pending
            jnfData.status = 'pending';
            jnfData.submissionDate = new Date();

            const updatedJNF = await this.jnf.findByIdAndUpdate(
                jnfId,
                jnfData,
                { new: true, runValidators: true }
            );

            if (!updatedJNF) {
                throw new Error('JNF not found');
            }

            apiResponse(200, jnf, "jnf deleted successful");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }
    async deleteJnf(jnfId) {
        try {
            const deletedJnf = await this.jnf.findByIdAndDelete(jnfId);
            return new apiResponse(200, jnf, "jnf deleted successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }
    async assignJNF(jnfId, userId) {
        try {
            const user = await this.user.findById(userId);
            if (!user) {
                return null;
            }
            const jnf = await this.jnf.findByIdAndUpdate(jnfId, { assignedUser: userId }, { new: true });
            return new apiResponse(200, jnf, "jnf assisgned successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }

    async getAvailableStatuses() {
        try {
            const statuses = await this.jnf.distinct('status');
            return new apiResponse(200, statuses, "statuses fetched successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }
    async getJnfAssignments(jnfId) {
        try {
            const jnf = await this.jnf
                .findById(jnfId)
                .select('assignedUser')  // Only select the assignedUser field
                .populate('assignedUser', 'name email'); // Populate only name and email

            if (!jnf) {
                return new apiResponse(404, null, "JNF not found");
            }

            // If there's an assigned user, format the response
            if (jnf.assignedUser) {
                const assignmentData = {
                    user: {
                        _id: jnf.assignedUser._id,
                        name: jnf.assignedUser.name,
                        email: jnf.assignedUser.email
                    },
                    assignedDate: jnf.updatedAt // Using updatedAt as assignment date
                };
                return new apiResponse(200, assignmentData, "JNF assignment fetched successfully");
            }

            // If no user is assigned
            return new apiResponse(200, null, "No user assigned to this JNF");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }
    async updateStatus(jnfId, status) {
        try {
            const jnf = await this.jnf.findByIdAndUpdate(
                jnfId,
                {
                    status,
                    reviewDate: new Date()
                },
                { new: true }
            );

            if (!jnf) {
                return new apiResponse(404, null, "JNF not found");
            }

            return new apiResponse(200, jnf, "JNF status updated successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }

    async saveDraft(jnfData) {
        try {
            // Use the static method from schema
            const draft = await this.jnf.saveDraft(jnfData);
            return new apiResponse(200, draft, "Draft saved successfully");
        } catch (error) {
            console.error("Error in saveDraft model:", error);
            return new apiResponse(400, null, error.message);
        }
    }

    async updateDraft(id, draftData) {
        try {
            const draft = await this.jnf.findById(id);
            if (!draft) {
                throw new Error('Draft not found');
            }

            // Set status to draft
            draftData.status = 'draft';

            // Update and validate
            Object.assign(draft, draftData);
            const errors = draft.validateDraft();
            if (errors.length > 0) {
                throw new Error(errors.join(', '));
            }

            await draft.save();
            return new apiResponse(200, draft, "Draft updated successfully");
        } catch (error) {
            console.error("Error in updateDraft model:", error);
            return new apiResponse(400, null, error.message);
        }
    }

    async getDrafts() {
        try {
            const drafts = await this.jnf.find({ status: 'draft' })
                .sort({ lastModified: -1 });
            return new apiResponse(200, drafts, "Drafts retrieved successfully");
        } catch (error) {
            console.error("Error in getDrafts model:", error);
            return new apiResponse(500, null, error.message);
        }
    }
}