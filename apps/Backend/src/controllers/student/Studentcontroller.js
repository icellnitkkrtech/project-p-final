import asyncHandler from "../../utils/asyncHandler.js";
import StudentService from "../../services/student/studentService.js";
import Student from "../../schema/student/studentSchema.js"; // Import the Mongoose model directly
import StudentModel from "../../models/studentModel.js"; // Import the StudentModel

export default class StudentController {
  constructor() {
    // this.studentService = new StudentService();
    // this.studentModel = new StudentModel();
    this.studentService = new StudentService(new StudentModel());
  }
  registerStudent = asyncHandler(async (req, res) => {
    const student = await this.studentService.registerStudent(req.body);
    res.status(student.statusCode).json(student);
  });

  updateProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedProfile = await this.studentService.updateProfile(
      id,
      req.body
    );
    res.status(updatedProfile.statusCode).json(updatedProfile);
  });
  getProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const profile = await this.studentService.getProfile(id);
    res.status(profile.statusCode).json(profile);
  });

  getStudentByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const response = await this.studentService.getStudentByUserId(userId);
    res.status(response.statusCode).json(response);
  });

  getStudentByRollNo = asyncHandler(async (req, res) => {
    const rollNo = req.rollNo;
    const profile = await this.studentService.getStudentByRollNo(rollNo);
    res.status(profile.statusCode).json(profile);
  });

  //notification controllers for students
  getNotifications = asyncHandler(async (req, res) => {
    const notifications = await this.studentService.getNotifications();
    res.status(notifications.statusCode).json(notifications);
  });

  async completeProfile(req, res) {
    try {
      const { userId, personalInfo, academics } = req.body;

      if (!userId || !personalInfo || !academics) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      // Check if user exists using the Mongoose model directly
      const existingStudent = await Student.findOne({ user: userId });
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: "Student profile already exists",
        });
      }

      const student = await this.studentService.completeProfile(
        userId,
        personalInfo,
        academics
      );

      return res.status(200).json({
        success: true,
        message: "Profile completed successfully",
        data: { student },
      });
    } catch (error) {
      console.error("Error in completeProfile:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to complete profile",
      });
    }
  }

  getTotalStudents = asyncHandler(async (req, res) => {
    // const totalStudentsResponse = await this.studentModel.getTotalStudents();
    const totalStudentsResponse = await this.studentService.getTotalStudents();
    res.status(totalStudentsResponse.statusCode).json(totalStudentsResponse);
  });

  // New method to get students based on query parameters
  getStudents = asyncHandler(async (req, res) => {
    const response = await this.studentService.getStudents();
    res.status(response.statusCode).json(response);
  });

  registerStudentByAdmin = asyncHandler(async (req, res) => {
    const student = await this.studentService.registerStudentByAdmin(req.body);
    res.status(student.statusCode).json(student);
  });

  deleteStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await this.studentService.deleteStudent(id);
    res.status(result.statusCode).json(result);
  });

  // Add these methods in the StudentController class
  debourStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user?._id; // Assuming you have user info in request

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Reason for debouring is required",
      });
    }

    const result = await this.studentService.debourStudent(id, reason, adminId);
    res.status(result.statusCode).json(result);
  });

  // Add this method to the StudentController class
  revokeDebour = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user?._id; // Assuming you have user info in request

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Reason for revoking debour is required",
      });
    }

    const result = await this.studentService.revokeDebour(id, reason, adminId);
    res.status(result.statusCode).json(result);
  });

  // Add this method to StudentController class
  updateStudentCGPA = asyncHandler(async (req, res) => {
    const { rollNumber } = req.params;
    const { cgpa } = req.body;

    const result = await this.studentService.updateStudentCGPA(rollNumber, cgpa);
    res.status(result.statusCode).json(result);
  });
}
