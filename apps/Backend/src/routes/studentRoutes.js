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

studentRouter.get("/getStudentByRollNo", (req, res) =>
  StudentController.getStudentByRollNo(req, res)
);

// for student job management
studentRouter.get("/eligible-jobs/:id", (req, res) =>
  ApplicationController.getEligibleJobs(req, res)
);
studentRouter.get("/applications/:studentId", (req, res) =>
  ApplicationController.getApplicationsByStudent(req, res)
);
studentRouter.post("/apply/:studentId/:jobId", (req, res) =>
  ApplicationController.applyForJob(req, res)
);

//notifications for the student

studentRouter.get("/notifications", (req, res) => {
  StudentController.getNotifications(req, res);
});

studentRouter.post("/complete-profile", (req, res) =>
  StudentController.completeProfile(req, res)
);

// New route for fetching students with query parameters
studentRouter.get("/", (req, res) =>
  StudentController.getStudents(req, res)
);

export default studentRouter;
