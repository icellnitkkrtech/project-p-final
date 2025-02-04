import jobModel from "../models/jobModel.js";
import apiResponse from "../utils/apiResponse.js";

export default class JobService {
  constructor() {
    this.JobModel = new jobModel();
  }

  async getAllJobs() {
    console.log("Service layer: getAllJobs called");
    try {
      const response = await this.JobModel.getAllJobs();
      // console.log("JobService response:", response);
      if (!response || !response.data) {
        return [];
      }
      return response.data;
    } catch (error) {
      console.error("Error getting jobs:", error);
      return [];
    }
  }

  async createJob(jnfId, createdBy) {
    console.log("Service layer: createJobFromJNF called");
    try {
      const response = await this.JobModel.createJob(jnfId, createdBy);

      return new apiResponse(200, response, "Job created successfully");
    } catch (error) {
      return new apiResponse(500, null, error.message);
    }
  }

  async getJobById(jobid) {
    console.log("Service layer: getJob called");
    try {
      const response = await this.JobModel.getJobById(jobid);

      return new apiResponse(200, response, "Job Found successfully");
    } catch (error) {
      return new apiResponse(500, null, error.message);
    }
  }

  async updateJob(jobid, updates) {
    console.log("Service layer: updateJob called");
    try {
      const response = await this.JobModel.updateJob(jobid, updates);

      return new apiResponse(200, response, "Job Updated successfully");
    } catch (error) {
      return new apiResponse(500, null, error.message);
    }
  }

  async deleteJob(jobid) {
    console.log("Service layer: deleteJob called");
    try {
      const response = await this.JobModel.deleteJob(jobid);

      return new apiResponse(200, response, "Job deleted successfully");
    } catch (error) {
      return new apiResponse(500, null, error.message);
    }
  }

  async activateJob(jobId) {
    console.log("Service layer: activateJob called");
    try {
      const response = await this.JobModel.activateJob(jobId);

      return new apiResponse(200, response, "Job activated successfully");
    } catch (error) {
      return new apiResponse(500, null, error.message);
    }
  }

  async closeJob(jobId) {
    console.log("Service layer: closeJob called");
    try {
      const response = await this.JobModel.closeJob(jobId);

      return new apiResponse(200, response, "Job closed successfully");
    } catch (error) {
      return new apiResponse(500, null, error.message);
    }
  }
}
