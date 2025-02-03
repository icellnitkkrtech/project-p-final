import { Router } from "express";
import CompanyModel from "../models/companyModel.js";
import CompanyServices from "../services/companyServices.js";
import CompanyController from "../controllers/company/Companycontroller.js";

const companyRouter = Router();
const companyModel = new CompanyModel();
const companyServices = new CompanyServices(companyModel);
const companyController = new CompanyController(companyServices);

companyRouter.post("/register", (req, res) => {
  companyController.createCompany(req, res);
});
companyRouter.get("/profile/:id", (req, res) => {
  companyController.getCompany(req, res);
});

companyRouter.put("/update/:id", (req, res) => {
  companyController.updateCompany(req, res);
});
companyRouter.delete("/remove/:id", (req, res) => {
  companyController.deleteCompany(req, res);
});
companyRouter.post("/:id/add-jnf", (req, res) => {
  companyController.addJNFToCompany(req, res);
});
companyRouter.get("/:id/jnfs", (req, res) => {
  companyController.getJNFsForCompany(req, res);
});

export default companyRouter;
