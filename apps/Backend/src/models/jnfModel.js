
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
                return  new apiResponse(200, jnfData, "jnf created successfully");
                } catch (error) {
                    return new apiResponse(500, null, error.message);
                    }
                    }
        async updateJnf(jnfId, jnfData) {

            try {
                const updatedJnf = await this.jnf.findByIdAndUpdate
                (jnfId, jnfData, { new: true });
                return  new apiResponse(200, jnfData, "jnf updated successfully");
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
                    
                }
                