import { Router } from "express";
import AdminController from "../controllers/admin/Admincontroller.js";
import AdminServices from "../services/adminServices.js";
import Student from "../schema/student/studentSchema.js";
import User from "../schema/userSchema.js";
const adminRouter = Router();
const adminService = new AdminServices(Student, User);
const adminController = new AdminController(adminService);

adminRouter.post("/createadmin", (req, res) => {
  adminController.createAdmin(req, res);
});

// admin control over student
adminRouter.post("/verifyuser", (req, res) => {
  adminController.verifyandLockUser(req, res);
});

adminRouter.post("/unlockuser", (req, res) => {
  adminController.unlockUserProfile(req, res);
});

// promoting user as pcc member
adminRouter.post("/demoteadmin", (req, res) => {
  adminController.demoteAdmin(req, res);
});
//demoting user
adminRouter.post("/promoteadmin", (req, res) => {
  adminController.promoteAdmin(req, res);
});
//remove user
//remove company
//

export default adminRouter;
