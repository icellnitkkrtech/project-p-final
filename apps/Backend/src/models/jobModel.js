import Job from "../schema/company/jobSchema.js";
import JNF from "../schema/company/jnfSchema.js";
import apiResponse from "../utils/apiResponse.js";

export default class jobModel {
  job = Job;
  Jnf = JNF;

  async getAllJobs() {
    try {
      const jobs = await this.job
        .find()
        .select(
          "title company description requirements eligibility salary status applicationDeadline numberOfPositions"
        )
        .lean();
      return new apiResponse(200, jobs || [], "Jobs retrieved successfully");
    } catch (error) {
      console.error("Error in getAllJobs:", error);
      return new apiResponse(500, null, error.message);
    }
  }
  async createJob(jnfId, createdBy) {
    console.log("Job Model: createJob called", jnfId);
    try {
      const jnf = await this.Jnf.findById(jnfId);
      if (!jnf) {
        return new apiResponse(404, jnf, "JNF with ID ${jnfId} not found");
      }

      const { eligibleBranches, jobProfiles, eligibilityCriteria } = jnf;

      // Create and save each job one by one
      for (const profile of jobProfiles) {
        const {
          course,
          designation,
          jobDescription,
          ctc,
          takeHome,
          perks,
          trainingPeriod,
          placeOfPosting,
        } = profile;

        let departments = [];
        if (course === "B.Tech") {
          departments = eligibleBranches.btech
            .filter((branch) => branch.eligible)
            .map((branch) => branch.name);
        } else if (course === "M.Tech") {
          departments = eligibleBranches.mtech
            .filter((department) => department.eligible)
            .map((department) => department.department);
        }

        const newJob = await this.job.create({
          course,
          departments,
          designation,
          jobDescription,
          eligibilityCriteria,
          ctc,
          takeHome,
          perks,
          trainingPeriod,
          placeOfPosting,
          jnf: jnfId,
          createdBy,
          status: "pendingAdminApproval",
        });
        console.log(newJob);
      }

      new apiResponse(200, null, "Job updated successfully");
    } catch (error) {
      console.error("Error creating job from JNF:", error);
      return new apiResponse(500, null, error.message);
    }
  }

  async getJobById(jobid) {
    console.log("Job Model: getJobById called");

    try {
      const job = await this.job.findById(jobid);
      if (!job) {
        return null;
      }

      return new apiResponse(200, job, "Job retrieved successfully");
    } catch (error) {
      return new apiResponse(500, null, error.message);
    }
  }

  async updateJob(jobid, updates) {
    console.log("Job Model: updateJob called");
    try {
      const updatedJob = await this.job.findByIdAndUpdate(jobid, updates, {
        new: true,
      });
      console.log(updatedJob);

      if (!updatedJob) {
        console.log("not updated");
        return null;
      }
      return new apiResponse(200, updatedJob, "Job updated successfully");
    } catch (error) {
      return new apiResponse(500, null, error.message);
    }
  }

  async deleteJob(jobid) {
    console.log("Job Model: deleteJob called");
    try {
      const deletedJob = await this.job.findByIdAndDelete(jobid);
      if (!deletedJob) {
        return new apiResponse(404, null, "Job not found");
      }
      return new apiResponse(200, null, "Job deleted successfully");
    } catch (error) {
      console.error("Error in deleteJob:", error.message);
      return new apiResponse(500, null, error.message);
    }
  }

  async activateJob(jobId) {
    console.log("Job Model: activateJob called");
    try {
      const updatedJob = await this.job.findByIdAndUpdate(
        jobId,
        { status: "open" },
        { new: true }
      );

      if (!updatedJob) {
        return null;
      }

      return new apiResponse(200, updatedJob, "Job activated successfully");
    } catch (error) {
      return new apiResponse(500, null, error.message);
    }
  }

  async closeJob(jobId) {
    console.log("Job Model: closeJob called");
    try {
      const updatedJob = await this.job.findByIdAndUpdate(
        jobId,
        { status: "closed" },
        { new: true }
      );

      if (!updatedJob) {
        return null;
      }

      return new apiResponse(200, updatedJob, "Job closed successfully");
    } catch (error) {
      return new apiResponse(500, null, error.message);
    }
  }
}
