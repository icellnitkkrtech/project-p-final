import ApplicationModel from "../../models/applicationModel.js";
import apiResponse from "../../utils/apiResponse.js";
import StudentService from "./studentService.js";
import JobService from "../jobService.js";
//for student : to get all jobs details and his applied jobs details
export default class ApplicationService {
  constructor() {
    this.studentServices = new StudentService();
    this.jobServices = new JobService();
    this.applicationModel = new ApplicationModel();
  }
  async applyForJob(studentId, jobId) {
    try {
      const student = await this.studentServices.getStudentById(studentId);
      if (!student) {
        return new apiResponse(404, null, "Student not found");
      }
      const job = await this.jobServices.getJobById(jobId);
      if (!job) {
        return new apiResponse(404, null, "Job not found");
      }

      const isEligible = await this.checkEligibility(student, job);
      if (!isEligible) {
        return apiResponse(404, null, "You are not eligible for this job ");
      }
      const application = await this.applicationModel.applyForJob(
        studentId,
        jobId
      );
      return new apiResponse(
        201,
        application,
        "Application created successfully"
      );
    } catch (error) {
      return new apiResponse(500, null, error.message);
    }
  }
  async getApplicationsByStudent(studentId) {
    try {
      const student = await this.studentServices.getStudentById(studentId);

      if (student.statusCode === 404) {
        return new apiResponse(404, null, "Student not found");
      }

      const applications =
        await this.applicationModel.getApplicationsByStudent(studentId);
      return applications;
    } catch (error) {
      console.error("Service error:", error);
      return new apiResponse(500, null, "Error fetching applications");
      // return new apiResponse(500, null, error.message);
    }
  }

  async checkEligibility(student, job) {
    try {
      // Check if student has required data
      if (!student?.data?.academics?.cgpa) {
        console.log("Missing student CGPA");
        return false;
      }

      // Basic eligibility checks
      const cgpa = parseFloat(student.data.academics.cgpa);
      const requiredCGPA = job.eligibilityCriteria?.minCGPA || 0;

      console.log("Checking eligibility:", {
        studentCGPA: cgpa,
        requiredCGPA,
        studentDept: student.data.personalInfo.department,
        eligibleDepts: job.departments,
      });

      if (cgpa < requiredCGPA) {
        return false;
      }

      // Department check if specified
      if (job.departments && job.departments.length > 0) {
        if (!job.departments.includes(student.data.personalInfo.department)) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error checking eligibility:", error);
      return false;
    }
  }
  async getEligibleJobs(studentId) {
    try {
      const student = await this.studentServices.getStudentById(studentId);
      if (!student) {
        return new apiResponse(404, null, "Student not found");
      }

      const allJobs = await this.jobServices.getAllJobs();
      // console.log("ApplicationService allJobs:", allJobs);

      if (!Array.isArray(allJobs)) {
        console.error("Jobs is not an array:", allJobs);
        return new apiResponse(200, { jobs: [] }, "No jobs available");
      }

      const mappedJobs = allJobs.map((job) => ({
        _id: job._id,
        title: job.title,
        company: job.company,
        description: job.description,
        requirements: job.requirements || [],
        eligibility: {
          departments: job.eligibility?.departments || [],
          minCGPA: job.eligibility?.minCGPA || 0,
          batch: job.eligibility?.batch,
        },
        salary: {
          ctc: job.salary?.ctc || 0,
          breakup: job.salary?.breakup || "",
        },
        status: job.status,
        numberOfPositions: job.numberOfPositions,
        deadline: job.applicationDeadline,
      }));
      // console.log("Mapped jobs:", mappedJobs);
      return new apiResponse(
        200,
        { jobs: mappedJobs },
        "Jobs fetched successfully"
      );
    } catch (error) {
      console.error("Error in getEligibleJobs:", error);
      return new apiResponse(500, null, error.message);
    }
  }
}
