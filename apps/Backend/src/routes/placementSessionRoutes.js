import { Router } from "express";
import PlacementSessionController from "../controllers/placement/placementSessionController.js";

const placementSessionRoutes = Router();
const placementSessionController = new PlacementSessionController();

// Get all placement sessions
placementSessionRoutes.get("/", (req, res) => {
  placementSessionController.getAllSessions(req, res);
});

// Get a specific placement session
placementSessionRoutes.get("/:id", (req, res) => {
  placementSessionController.getSessionById(req, res);
});

// Create a new placement session
placementSessionRoutes.post("/", (req, res) => {
  placementSessionController.createSession(req, res);
});

// Update a placement session
placementSessionRoutes.put("/:id", (req, res) => {
  placementSessionController.updateSession(req, res);
});

// Delete a placement session
placementSessionRoutes.delete("/:id", (req, res) => {
  placementSessionController.deleteSession(req, res);
});

export default placementSessionRoutes; 