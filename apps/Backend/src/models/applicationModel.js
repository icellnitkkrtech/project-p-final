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
      //check isplaced
      if (student.isPlaced) {
        return new apiResponse(
          400,
          null,
          "You are already placed in a company"
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

      // Fetch placement drive to check round details
      // const drive = await this.placementDrive.findById(driveId);
      if (!drive?.roundDetails?.rounds?.length) {
        console.error("No rounds found in the drive");
        return new apiResponse(
          500,
          null,
          "Drive rounds not properly configured"
        );
      }

      // Ensure round 1 exists
      const roundExists = drive.roundDetails.rounds.some(
        (round) => round.roundNumber === 1
      );
      if (!roundExists) {
        console.error("Round 1 not found in the drive");
        return new apiResponse(
          500,
          null,
          "Round 1 does not exist in drive details"
        );
      }

      // Update placement drive: push student ID to `applicantStudents` in both global & rounds
      const updatedDrive = await this.placementDrive.findByIdAndUpdate(
        driveId,
        {
          $push: {
            applicantStudents: studentId,
          },
          $addToSet: {
            "roundDetails.rounds.$[round].applicantStudents": studentId,
            "roundDetails.rounds.$[round].appearedStudents": studentId,
          },
        },
        {
          arrayFilters: [{ "round.roundNumber": 1 }], // Ensure roundNumber is correctly filtered
          new: true,
          runValidators: true,
        }
      );

      if (!updatedDrive) {
        console.error("Failed to update drive with round details");
        return new apiResponse(500, null, "Failed to update drive details");
      }

      console.log("Updated drive:", JSON.stringify(updatedDrive, null, 2));

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
          path: "roundStatus",
          select: "roundNumber roundName status feedback date interviewer",
          populate: {
            path: "interviewer",
            select: "name email",
          },
        })
        .populate({
          path: "documents.verifiedBy",
          select: "name email",
        })
        .populate({
          path: "timeline.updatedBy",
          select: "name email",
        });
      console.log(applications);
      if (!applications || applications.length === 0) {
        return new apiResponse(404, [], "No applications found");
      }
      // Add round status initialization for new applications
      const updatedApplications = applications.map((application) => {
        if (!application.roundStatus || application.roundStatus.length === 0) {
          // Initialize round status for each round in the selection process
          application.roundStatus =
            application.placementDrive?.selectionProcess?.[0]?.rounds?.map(
              (round) => ({
                roundNumber: round.roundNumber,
                roundName: round.roundName,
                status: "pending",
                date: null,
                feedback: "",
              })
            ) || [];

          // Save the initialized round status
          application.save();
        }
        return application;
      });
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

  async updateRoundStatus(applicationId, roundNumber, updateData) {
    try {
      const application = await this.application.findById(applicationId);

      if (!application) {
        return new apiResponse(404, null, "Application not found");
      }

      // Find the index of the round to update
      const roundIndex = application.roundStatus.findIndex(
        (round) => round.roundNumber === roundNumber
      );

      if (roundIndex === -1) {
        // Round status doesn't exist, create it
        application.roundStatus.push({
          roundNumber,
          ...updateData,
        });
      } else {
        // Update existing round status
        application.roundStatus[roundIndex] = {
          ...application.roundStatus[roundIndex],
          ...updateData,
        };
      }

      await application.save();

      return new apiResponse(
        200,
        application,
        "Round status updated successfully"
      );
    } catch (error) {
      console.error("Update error:", error);
      return new apiResponse(500, null, "Error updating round status");
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

  async getApplicationById(applicationId) {
    try {
      const application = await Application.findById(applicationId)
        .populate("student")
        .populate({
          path: "placementDrive",
          populate: {
            path: "company",
            model: "Company",
          },
        });
      return application;
    } catch (error) {
      console.error("Model error:", error);
      throw error;
    }
  }

  async updateOfferResponse(applicationId, response, responseDate) {
    try {
      const application = await Application.findByIdAndUpdate(
        applicationId,
        {
          "offerDetails.response": response,
          "offerDetails.responseDate": responseDate,
        },
        { new: true }
      );
      return application;
    } catch (error) {
      console.error("Model error:", error);
      throw error;
    }
  }
}
