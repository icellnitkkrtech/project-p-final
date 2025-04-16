import PlacementSessionService from "../../services/placementSessionService.js";

export default class PlacementSessionController {
  constructor() {
    this.placementSessionService = new PlacementSessionService();
  }

  async getAllSessions(req, res) {
    try {
      const sessions = await this.placementSessionService.getAllSessions();
      res.status(200).json({ data: sessions });
    } catch (error) {
      console.error("Error fetching placement sessions:", error);
      res.status(500).json({ 
        message: "Error fetching placement sessions", 
        error: error.message 
      });
    }
  }

  async getSessionById(req, res) {
    try {
      const session = await this.placementSessionService.getSessionById(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Placement session not found" });
      }
      res.status(200).json({ data: session });
    } catch (error) {
      console.error("Error fetching placement session:", error);
      res.status(500).json({ 
        message: "Error fetching placement session", 
        error: error.message 
      });
    }
  }

  async createSession(req, res) {
    try {
      const sessionData = req.body;
      const newSession = await this.placementSessionService.createSession(sessionData);
      res.status(201).json({ data: newSession });
    } catch (error) {
      console.error("Error creating placement session:", error);
      res.status(500).json({ 
        message: "Error creating placement session", 
        error: error.message 
      });
    }
  }

  async updateSession(req, res) {
    try {
      const sessionData = req.body;
      const updatedSession = await this.placementSessionService.updateSession(
        req.params.id, 
        sessionData
      );
      if (!updatedSession) {
        return res.status(404).json({ message: "Placement session not found" });
      }
      res.status(200).json({ data: updatedSession });
    } catch (error) {
      console.error("Error updating placement session:", error);
      res.status(500).json({ 
        message: "Error updating placement session", 
        error: error.message 
      });
    }
  }

  async deleteSession(req, res) {
    try {
      const result = await this.placementSessionService.deleteSession(req.params.id);
      if (!result) {
        return res.status(404).json({ message: "Placement session not found" });
      }
      res.status(200).json({ message: "Placement session deleted successfully" });
    } catch (error) {
      console.error("Error deleting placement session:", error);
      res.status(500).json({ 
        message: "Error deleting placement session", 
        error: error.message 
      });
    }
  }
} 