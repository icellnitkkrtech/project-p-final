import ApplicationModel from "../../models/applicationModel.js";
import apiResponse from "../../utils/apiResponse.js";
import StudentService from "./studentService.js";

export default class ApplicationService {
  constructor() {
    this.applicationModel = new ApplicationModel();
    this.studentService = new StudentService();
  }

  async applyForPlacementDrive(studentId, driveId) {
    try {
      const student = await this.studentService.getStudentById(studentId);
      if (student.statusCode === 404) {
        return new apiResponse(404, null, "Student not found");
      }

      const result = await this.applicationModel.applyForPlacementDrive(
        studentId,
        driveId
      );
      return result;
    } catch (error) {
      console.error("Service error:", error);
      return new apiResponse(500, null, "Error submitting application");
    }
  }

  async getStudentApplications(studentId) {
    try {
      const student = await this.studentService.getStudentById(studentId);
      if (student.statusCode === 404) {
        return new apiResponse(404, null, "Student not found");
      }

      return await this.applicationModel.getStudentApplications(studentId);
    } catch (error) {
      console.error("Service error:", error);
      return new apiResponse(500, null, "Error fetching applications");
    }
  }
  async getApplicationDetail(applicationId) {
    try {
      return await this.applicationModel.getApplicationDetail(applicationId);
    } catch (error) {
      console.error("Service error:", error);
      return new apiResponse(500, null, "Error fetching application details");
    }
  }
  async getEligibleDrives(studentId) {
    try {
      const student = await this.studentService.getStudentById(studentId);
      if (student.statusCode === 404) {
        return new apiResponse(404, null, "Student not found");
      }

      const result = await this.applicationModel.getEligibleDrives(studentId);
      return result;
    } catch (error) {
      console.error("Service error:", error);
      return new apiResponse(500, null, "Error fetching eligible drives");
    }
  }
}
