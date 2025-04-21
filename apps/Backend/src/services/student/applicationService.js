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
 

async getOfferLetter(applicationId) {
  try {
    const application = await this.applicationModel.getApplicationById(applicationId);
    
    if (!application) {
      return new apiResponse(404, null, "Application not found");
    }
    
    if (!application.offerDetails) {
      return new apiResponse(404, null, "No offer letter available for this application");
    }
    
    return new apiResponse(200, application.offerDetails, "Offer letter fetched successfully");
  } catch (error) {
    console.error("Service error:", error);
    return new apiResponse(500, null, "Error fetching offer letter");
  }
}

async respondToOffer(applicationId, response) {
  try {
    if (!['accept', 'reject'].includes(response)) {
      return new apiResponse(400, null, "Invalid response. Must be 'accept' or 'reject'");
    }
    
    const application = await this.applicationModel.getApplicationById(applicationId);
    
    if (!application) {
      return new apiResponse(404, null, "Application not found");
    }
    
    if (!application.offerDetails) {
      return new apiResponse(404, null, "No offer letter available for this application");
    }
    
    // Update the offer response
    const updatedApplication = await this.applicationModel.updateOfferResponse(
      applicationId, 
      response, 
      new Date()
    );
    
    // If accepted, update student status to placed
    if (response === 'accept') {
      await this.studentService.updatePlacementStatus(
        application.student, 
        true, 
        application.placementDrive.companyDetails.name
      );
    }
    
    return new apiResponse(
      200, 
      updatedApplication, 
      `Offer ${response === 'accept' ? 'accepted' : 'rejected'} successfully`
    );
  } catch (error) {
    console.error("Service error:", error);
    return new apiResponse(500, null, "Error responding to offer");
  }
}
}
