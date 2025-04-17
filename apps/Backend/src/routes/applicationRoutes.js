// apps/Backend/src/routes/applicationRoutes.js
import { Router } from "express";
import applicationController from "../controllers/student/applicationController.js";
import ApplicationService from "../services/student/applicationService.js";

const applicationRoutes = Router();
const ApplicationController = new applicationController();

// Route to get offer letter for a student
applicationRoutes.get("/offer-letter/:applicationId", (req, res) => {
  ApplicationController.getOfferLetter(req, res);
});

// Route to accept or reject an offer
applicationRoutes.put("/respond-offer/:applicationId", (req, res) => {
  ApplicationController.respondToOffer(req, res);
});

export default applicationRoutes;