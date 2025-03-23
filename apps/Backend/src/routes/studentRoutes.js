import { Router } from "express";

import studentController from "../controllers/student/Studentcontroller.js";
import studentService from "../services/student/studentService.js";
import studentModel from "../models/studentModel.js";

import applicationController from "../controllers/student/applicationController.js";
import applicationService from "../services/student/applicationService.js";
import applicationModel from "../models/applicationModel.js";

const studentRouter = Router();

const StudentModel = new studentModel();
const StudentService = new studentService(StudentModel);
const StudentController = new studentController(StudentService);

const ApplicationModel = new applicationModel();
const ApplicationService = new applicationService(ApplicationModel);
const ApplicationController = new applicationController(ApplicationService);

//for student profile management
//tested and working all 3
studentRouter.post("/register", (req, res) =>
  StudentController.registerStudent(req, res)
);
studentRouter.put("/profile/:id", (req, res) =>
  StudentController.updateProfile(req, res)
);
studentRouter.get("/profile/:id", (req, res) =>
  StudentController.getProfile(req, res)
);

studentRouter.get("/profile/user/:userId", (req, res) =>
  StudentController.getStudentByUserId(req, res)
);

studentRouter.get("/getStudentByRollNo", (req, res) =>
  StudentController.getStudentByRollNo(req, res)
);

// Update placement drive related routes
studentRouter.get("/placement-drives/eligible/:studentId", (req, res) =>
  ApplicationController.getEligibleDrives(req, res)
);

studentRouter.get("/applications/:studentId", (req, res) =>
  ApplicationController.getStudentApplications(req, res)
);

studentRouter.post("/placement-drives/apply/:studentId/:driveId", (req, res) =>
  ApplicationController.applyForPlacementDrive(req, res)
);
// Add this route with your other application routes
studentRouter.get("/applications/detail/:applicationId", (req, res) =>
  ApplicationController.getApplicationDetail(req, res)
);
//notifications for the student

studentRouter.get("/notifications", (req, res) => {
  StudentController.getNotifications(req, res);
});

studentRouter.post("/complete-profile", (req, res) =>
  StudentController.completeProfile(req, res)
);

// // New route for fetching students with query parameters
// studentRouter.get("/getallstudent", (req, res) =>
//   StudentController.getStudents(req, res)
// );

// Route for fetching all students
studentRouter.get("/getallstudent", (req, res) =>
  StudentController.getStudents(req, res)
);

studentRouter.post("/register/admin", (req, res) =>
  StudentController.registerStudentByAdmin(req, res)
);

studentRouter.delete("/delete/:id", (req, res) =>
  StudentController.deleteStudent(req, res)
);

// debour routes
studentRouter.post("/debour/:id", (req, res) =>
  StudentController.debourStudent(req, res)
);

studentRouter.post("/revoke-debour/:id", (req, res) =>
  StudentController.revokeDebour(req, res)
);

// Add this route
studentRouter.put("/update-cgpa/:rollNumber", (req, res) =>
  StudentController.updateStudentCGPA(req, res)
);

export default studentRouter;
