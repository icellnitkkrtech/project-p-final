import StudentModel from "../../models/studentModel.js";
import UserServices from "../userServices.js";
import apiResponse from "../../utils/apiResponse.js";
import Student from "../../schema/student/studentSchema.js";

export default class StudentService {
  constructor() {
    this.studentModel = new StudentModel();
    this.userServices = new UserServices();
  }
  //basic services for students
  async registerStudent(studentData) {
    try {
      // Validate required fields
      if (
        !studentData.email ||
        !studentData.password ||
        !studentData.personalInfo?.rollNumber ||
        !studentData.personalInfo?.gender ||
        !studentData.personalInfo?.name ||
        !studentData.personalInfo?.course ||
        !studentData.personalInfo?.department ||
        !studentData.personalInfo?.batch ||
        !studentData.academics?.cgpa ||
        !studentData.academics?.tenthMarks ||
        !studentData.academics?.twelfthMarks
      ) {
        return new apiResponse(400, null, "Missing required fields");
      }

      const userData = {
        email: studentData.email,
        password: studentData.password,
        user_role: "student",
      };

      const user = await this.userServices.registerUser(userData);

      if (user.statusCode !== 201) {
        return new apiResponse(user.statusCode, null, user.message);
      }

      // Create student profile with existing structure
      const userId = user.data.user._id;
      const student = await this.studentModel.registerStudent(
        {
          personalInfo: studentData.personalInfo,
          academics: studentData.academics,
        },
        userId
      );

      if (student.statusCode !== 201) {
        await this.userServices.deleteUser(userId);
        return new apiResponse(student.statusCode, null, student.message);
      }

      return new apiResponse(
        201,
        {
          user: user.data,
          student: student.data,
        },
        "Student registered successfully"
      );
    } catch (error) {
      console.log("Registration error", error);
      return new apiResponse(500, null, error.message);
    }
  }
  async updateProfile(id, studentData) {
    try {
      const updatedProfile = await this.studentModel.updateProfile(
        id,
        studentData
      );
      return new apiResponse(
        updatedProfile.statusCode,
        updatedProfile.data,
        updatedProfile.message
      );
      // return new apiResponse(200, updatedProfile.data, "Profile updated successfully");
    } catch (error) {
      return new apiResponse(500, null, error.message);
    }
  }

  async getProfile(studentId) {
    try {
      const profile = await this.studentModel.getProfile(studentId);
      return new apiResponse(profile.statusCode, profile.data, profile.message);
      // return new apiResponse(200, profile.data, "Profile fetched successfully");
    } catch (error) {
      return new apiResponse(500, null, error.message);
    }
  }

  async getStudentByUserId(userId) {
    try {
      return await this.studentModel.getStudentByUserId(userId);
    } catch (error) {
      return new apiResponse(500, null, error.message);
    }
  }

  async getStudentById(studentId) {
    try {
      const student = await this.studentModel.getStudentById(studentId);
      return new apiResponse(200, student.data, "Student found successfully");
    } catch (error) {
      return new apiResponse(500, null, error.message);
    }
  }
  async getStudentByRollNo(rollNo) {
    try {
      if (!rollNo) {
        return apiResponse(400, null, "roll no is required");
      }
      const profile = await this.studentModel.getStudentByRollNo(rollNo);
      return apiResponse(200, profile, "Profile fetched successfully");
    } catch (error) {
      console.log("error in student service", error);
      return apiResponse(500, null, error.message);
    }
  }
  async completeProfile(userId, personalInfo, academics) {
    try {
      const student = await Student.findOneAndUpdate(
        { user: userId },
        {
          user: userId,
          personalInfo,
          academics,
          verificationStatus: "pending",
        },
        { new: true, upsert: true }
      );

      return student;
    } catch (error) {
      throw new Error("Failed to complete student profile: " + error.message);
    }
  }

  // Add the getStudents method
  async getStudents() {
    try {
      const students = await this.studentModel.getStudents(); // Fetch all students
      const sortedStudents = students.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      return new apiResponse(
        200,
        sortedStudents,
        "Students fetched successfully"
      );
    } catch (error) {
      throw new Error("Failed to fetch students: " + error.message);
    }
  }

  async registerStudentByAdmin(studentData) {
    try {
      console.log("Received student data:", studentData); // Debug log

      // Validate the structure of incoming data
      if (!studentData.personalInfo || !studentData.academics) {
        return new apiResponse(400, null, "Invalid data structure");
      }

      // Validate required fields with proper case matching
      if (
        !studentData.personalInfo.name ||
        !studentData.personalInfo.rollNumber ||
        !studentData.personalInfo.department ||
        !studentData.personalInfo.course ||
        !studentData.personalInfo.gender ||
        !studentData.personalInfo.category ||
        !studentData.academics.cgpa ||
        !studentData.academics.tenthMarks ||
        !studentData.academics.twelfthMarks
      ) {
        return new apiResponse(400, null, "Missing required fields");
      }

      // Generate email and password
      const email = `${studentData.personalInfo.rollNumber.toString().toLowerCase()}@nitkkr.ac.in`;
      const password = studentData.personalInfo.rollNumber.toString();

      // Create user data
      const userData = {
        email,
        password,
        user_role: "student",
      };

      // Create the user first
      const user = await this.userServices.registerUser(userData);
      if (user.statusCode !== 201) {
        return new apiResponse(user.statusCode, null, user.message);
      }

      // Format the student data correctly
      const formattedStudentData = {
        user: user.data.user._id,
        personalInfo: {
          name: studentData.personalInfo.name,
          rollNumber: studentData.personalInfo.rollNumber,
          department: studentData.personalInfo.department,
          course: studentData.personalInfo.course,
          batch:
            studentData.personalInfo.batch ||
            `${studentData.personalInfo.batchStartYear}-${studentData.personalInfo.batchEndYear}`,
          gender: studentData.personalInfo.gender,
          category: studentData.personalInfo.category,
        },
        academics: {
          cgpa: parseFloat(studentData.academics.cgpa),
          tenthMarks: parseFloat(studentData.academics.tenthMarks),
          twelfthMarks: parseFloat(studentData.academics.twelfthMarks),
        },
      };

      // Create student profile
      const newStudent = await this.studentModel.create(formattedStudentData);

      return new apiResponse(
        201,
        { user: user.data.user, student: newStudent },
        "Student registered successfully"
      );
    } catch (error) {
      console.error("Registration error:", error);
      return new apiResponse(500, null, error.message || "Registration failed");
    }
  }

  async deleteStudent(id) {
    try {
      const result = await this.studentModel.deleteStudent(id); // Call the model's delete method
      return result; // Return the result from the model
    } catch (error) {
      console.error("Error deleting student:", error);
      return new apiResponse(
        500,
        null,
        "An error occurred while deleting student"
      );
    }
  }

  // Add these methods in the StudentService class
  async debourStudent(studentId, reason, adminId) {
    try {
      const result = await this.studentModel.debourStudent(
        studentId,
        reason,
        adminId
      );
      return result;
    } catch (error) {
      return new apiResponse(
        500,
        null,
        "An error occurred while debouring student"
      );
    }
  }

  // Add this method to the StudentService class
  async revokeDebour(studentId, reason, adminId) {
    try {
      const result = await this.studentModel.revokeDebour(
        studentId,
        reason,
        adminId
      );
      return result;
    } catch (error) {
      return new apiResponse(
        500,
        null,
        "An error occurred while revoking student debour"
      );
    }
  }

  // Add this method to StudentService class
  async updateStudentCGPA(rollNumber, cgpa) {
    try {
      // Input validation
      if (!rollNumber || cgpa === undefined) {
        return new apiResponse(400, null, "Roll number and CGPA are required");
      }

      // Convert CGPA to number and validate
      const cgpaNum = Number(cgpa);
      if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
        return new apiResponse(
          400,
          null,
          "CGPA must be a number between 0 and 10"
        );
      }

      // Find student using StudentModel
      const student = await this.studentModel.findOne({
        "personalInfo.rollNumber": rollNumber,
      });

      if (!student) {
        return new apiResponse(
          404,
          null,
          `Student with roll number ${rollNumber} not found`
        );
      }

      // Update the CGPA
      const result = await this.studentModel.student.findOneAndUpdate(
        { "personalInfo.rollNumber": rollNumber },
        {
          $set: {
            "academics.cgpa": cgpaNum,
            updatedAt: new Date(),
          },
        },
        { new: true }
      );

      if (!result) {
        return new apiResponse(400, null, "Failed to update CGPA");
      }

      console.log(`Updated CGPA for student ${rollNumber} to ${cgpaNum}`);
      return new apiResponse(
        200,
        { rollNumber, cgpa: cgpaNum },
        "CGPA updated successfully"
      );
    } catch (error) {
      console.error("CGPA update error:", error);
      return new apiResponse(
        500,
        null,
        "Internal server error while updating CGPA"
      );
    }
  }
}
