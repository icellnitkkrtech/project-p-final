import asyncHandler from "../../utils/asyncHandler.js";
import ApplicationService from "../../services/student/applicationService.js";
import apiResponse from "../../utils/apiResponse.js";

export default class ApplicationController {
  constructor() {
    this.applicationService = new ApplicationService();
  }

  applyForPlacementDrive = asyncHandler(async (req, res) => {
    const { studentId, driveId } = req.params;
    const result = await this.applicationService.applyForPlacementDrive(
      studentId,
      driveId
    );
    res.status(result.statusCode).json(result);
  });

  getStudentApplications = asyncHandler(async (req, res) => {
    const { studentId } = req.params;
    if (!studentId) {
      return res
        .status(400)
        .json(new apiResponse(400, null, "Student ID is required"));
    }
    const applications =
      await this.applicationService.getStudentApplications(studentId);
    res.status(applications.statusCode).json(applications);
  });
  getApplicationDetail = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;
    if (!applicationId) {
      return res
        .status(400)
        .json(new apiResponse(400, null, "Application ID is required"));
    }
    const application =
      await this.applicationService.getApplicationDetail(applicationId);
    res.status(application.statusCode).json(application);
  });

  getEligibleDrives = asyncHandler(async (req, res) => {
    const { studentId } = req.params;
    const drives = await this.applicationService.getEligibleDrives(studentId);
    res.status(drives.statusCode).json(drives);
  });
  getOfferLetter = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;
    const result = await this.applicationService.getOfferLetter(applicationId);
    res.status(result.statusCode).json(result);
  });
  
  respondToOffer = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;
    const { response } = req.body; // 'accept' or 'reject'
    const result = await this.applicationService.respondToOffer(applicationId, response);
    res.status(result.statusCode).json(result);
  });
}
