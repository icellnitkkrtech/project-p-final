import { Application } from "../schema/general/applicationSchema.js";
import PlacementDrive from "../schema/placement/placementSchema.js";
import Student from "../schema/student/studentSchema.js";
import apiResponse from "../utils/apiResponse.js";

export default class ApplicationModel {
  application = Application;
  placementDrive = PlacementDrive;
  student = Student;

  async applyForPlacementDrive(studentId, driveId) {
    try {
      // Check if already applied
      const existingApplication = await this.application.findOne({
        student: studentId,
        placementDrive: driveId,
      });

      if (existingApplication) {
        return new apiResponse(
          400,
          null,
          "Already applied for this placement drive"
        );
      }

      // Get student and drive details to verify eligibility
      const student = await this.student.findById(studentId);
      const drive = await this.placementDrive.findById(driveId);

      if (!student || !drive) {
        return new apiResponse(
          404,
          null,
          "Student or Placement Drive not found"
        );
      }
      // Check if student is deboured
      if (student.isDeboured) {
        return new apiResponse(
          403,
          null,
          "You cannot apply as your account is deboured. Please contact the placement office."
        );
      }

      // Check eligibility
      if (student.academics.cgpa < drive.eligibilityCriteria.minCgpa) {
        return new apiResponse(
          400,
          null,
          "Student does not meet CGPA criteria"
        );
      }

      // Create application
      const application = new this.application({
        student: studentId,
        placementDrive: driveId,
        status: "applied",
      });

      await application.save();

      // Update student's applications array
      await this.student.findByIdAndUpdate(studentId, {
        $push: { applications: application._id },
      });

      // Update placement drive's applicants array
      await this.placementDrive.findByIdAndUpdate(driveId, {
        $push: { applicantStudents: studentId },
       
      });

      return new apiResponse(
        201,
        application,
        "Application submitted successfully"
      );
    } catch (error) {
      console.error("Application error:", error);
      return new apiResponse(500, null, "Error creating application");
    }
  }

  async getStudentApplications(studentId) {
    try {
      const applications = await this.application
        .find({ student: studentId })
        .populate({
          path: "placementDrive",
          select:
            "placementDrive_title companyDetails jobProfile applicationDetails status eligibilityCriteria selectionProcess eligibleBranchesForProfiles bondDetails",
          populate: [
            {
              path: "selectionProcess",
              select: "profileId rounds expectedRecruits tentativeDate",
            },
          ],
        })
        .populate({
          path: "roundStatus.interviewer",
          select: "name email",
        })
        .populate({
          path: "documents.verifiedBy",
          select: "name email",
        })
        .populate({
          path: "timeline.updatedBy",
          select: "name email",
        });
 console.log(applications)
      if (!applications || applications.length === 0) {
        return new apiResponse(404, [], "No applications found");
      }

      return new apiResponse(
        200,
        applications,
        "Applications fetched successfully"
      );
    } catch (error) {
      console.error("Query error:", error);
      return new apiResponse(500, null, "Error fetching applications");
    }
  }
  async getApplicationDetail(applicationId) {
    try {
      const application = await this.application
        .findById(applicationId)
        .populate({
          path: "placementDrive",
          select:
            "placementDrive_title companyDetails jobProfile applicationDetails status eligibilityCriteria selectionProcess eligibleBranchesForProfiles bondDetails",
        })
        .populate({
          path: "student",
          select: "personalInfo academics",
        })
        .populate({
          path: "roundStatus.interviewer",
          select: "name email",
        })
        .populate({
          path: "documents.verifiedBy",
          select: "name email",
        })
        .populate({
          path: "timeline.updatedBy",
          select: "name email",
        });

      if (!application) {
        return new apiResponse(404, null, "Application not found");
      }

      return new apiResponse(
        200,
        application,
        "Application details fetched successfully"
      );
    } catch (error) {
      console.error("Query error:", error);
      return new apiResponse(500, null, "Error fetching application details");
    }
  }
  async getEligibleDrives(studentId) {
    try {
      const student = await this.student.findById(studentId).populate("user");

      if (!student) {
        return new apiResponse(404, null, "Student not found");
      }

      const drives = await this.placementDrive.find({
        status: "inProgress",
        "eligibleBranchesForProfiles.branches.btech.name":
          student.personalInfo.department,
      });

      return new apiResponse(
        200,
        drives,
        "Eligible drives fetched successfully"
      );
    } catch (error) {
      console.error("Query error:", error);
      return new apiResponse(500, null, "Error fetching eligible drives");
    }
  }
}
