import JNF from "../schema/company/jnfSchema.js";
import User from "../schema/userSchema.js";
import apiResponse from "../utils/apiResponse.js";
import CompanyModel from './companyModel.js';

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
            console.log('Creating JNF in model with data:', {
                submittedBy: jnfData.submittedBy,
                companyName: jnfData.companyDetails?.name
            });

            // Set initial status and dates
            const dataToSave = {
                ...jnfData,
                status: 'pending',
                submissionDate: new Date(),
                createdAt: new Date()
            };

            const newJnf = await this.jnf.create(dataToSave);
            
            // Populate submittedBy field
            const populatedJnf = await newJnf.populate('submittedBy', 'name email');
            
            console.log("New JNF created:", {
                id: populatedJnf._id,
                company: populatedJnf.companyDetails?.name,
                submittedBy: populatedJnf.submittedBy
            });

            return new apiResponse(200, populatedJnf, "JNF created successfully");
        } catch (error) {
            console.error('Error in createJnf model:', error);
            if (error.name === 'ValidationError') {
                return new apiResponse(400, null, `Validation Error: ${error.message}`);
            }
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
            const jnf = await this.jnf.findById(jnfId);
            if (!jnf) {
                return new apiResponse(404, null, "JNF not found");
            }

            // Update JNF status
            jnf.status = status;
            jnf.reviewDate = new Date();
            await jnf.save();

            // If status is approved, create company
            if (status === 'approved') {
                const companyModel = new CompanyModel();
                const companyData = {
                    user: jnf.submittedBy,
                    companyName: jnf.companyDetails.name,
                    email: jnf.companyDetails.email,
                    website: jnf.companyDetails.website || '',
                    JNFs: [jnf._id], // Add this JNF to the company's JNFs array
                    recruitmentStatus: 'upcoming',
                    hiringSince: new Date()
                };
                const userId = jnf.submittedBy;
                if (!userId) {
                    throw new Error('No user associated with this JNF');
                }
                const companyResponse = await companyModel.createCompanyBYAdmin(companyData, userId);
                if (!companyResponse.success) {
                    throw new Error('Failed to create company from JNF');
                }

                // Update JNF with company reference
                jnf.company = companyResponse.data._id;
                await jnf.save();

                return new apiResponse(200, {
                    jnf,
                    company: companyResponse.data
                }, "JNF approved and company created successfully");
            }

            return new apiResponse(200, jnf, "JNF status updated successfully");
        } catch (error) {
            console.error("Error in updateStatus:", error);
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