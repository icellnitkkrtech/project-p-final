import express from 'express';
import CompanyModel from "../models/companyModel.js";
import CompanyServices from "../services/companyServices.js";
import CompanyController from "../controllers/company/Companycontroller.js";
import authVerify from "../middlewares/auth.middlewares.js";

const companyRouter = express.Router();
const companyModel = new CompanyModel();
const companyServices = new CompanyServices(companyModel);
const companyController = new CompanyController(companyServices);

// Company CRUD operations
companyRouter.post("/register", (req, res) => {
  companyController.createCompany(req, res);
});

companyRouter.get("/all", authVerify, (req, res) => {
  console.log("Route: GET /all hit");
  return companyController.getAllCompanies(req, res);
});

companyRouter.get("/profile/user/:userId", (req, res) => {
  companyController.getCompanyByUserId(req, res);
});

companyRouter.get("/getone/:id",  (req, res) => {
  companyController.getCompany(req, res);
});//done

companyRouter.put("/update/:id", authVerify, (req, res) => {
  console.log("Update route hit for company:", req.params.id);
  return companyController.updateCompany(req, res);
});//done

companyRouter.delete("/delete/:id_company/:id_user", authVerify, (req, res) => {
  companyController.deleteCompany(req, res);
});

// JNF related routes
companyRouter.post("/:id/add-jnf",  (req, res) => {
  companyController.addJNFToCompany(req, res);
});

companyRouter.get("/:id/jnfs", authVerify, (req, res) => {
  companyController.getJNFsForCompany(req, res);
});

// New routes for company details
companyRouter.get("/:id", authVerify, (req, res) => {
  console.log("Route: GET /:id hit", req.params.id);
  return companyController.getCompanyById(req, res);
});

companyRouter.get("/:id/visits", authVerify, (req, res) => {
  return companyController.getCompanyVisits(req, res);
});

companyRouter.get("/:id/placed-students", authVerify, companyController.getPlacedStudents);

companyRouter.get("/:id/job-profiles",  companyController.getJobProfiles);

// Add new placement
companyRouter.post("/:id/placements", authVerify, (req, res) => {
  companyController.addPlacement(req, res);
});

// Update placement
companyRouter.put("/placements/:placementId", authVerify, (req, res) => {
  companyController.updatePlacement(req, res);
});

// Get placement statistics
companyRouter.get("/:id/placement-stats", authVerify, (req, res) => {
  companyController.getPlacementStats(req, res);
});

// Add these new routes for placement management
// companyRouter.post("/:driveId/applications",  (req, res) => {
//   companyController.submitApplication(req, res);
// });

companyRouter.get("/:driveId/applications",  (req, res) => {
  companyController.getDriveApplications(req, res);
});

companyRouter.put("/:driveId/applications/:applicationId/status", authVerify, (req, res) => {
  companyController.updateApplicationStatus(req, res);
});

companyRouter.post("/:driveId/placements", authVerify, (req, res) => {
  companyController.createPlacement(req, res);
});

export default companyRouter;
