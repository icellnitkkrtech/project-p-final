import PlacementSession from "../schema/placement/placementSessionSchema.js";

export default class PlacementSessionService {
  async getAllSessions() {
    try {
      return await PlacementSession.find().sort({ name: -1 });
    } catch (error) {
      console.error("Error in getAllSessions:", error);
      throw error;
    }
  }

  async getSessionById(id) {
    try {
      return await PlacementSession.findById(id);
    } catch (error) {
      console.error("Error in getSessionById:", error);
      throw error;
    }
  }

  async createSession(sessionData) {
    try {
      return await PlacementSession.create(sessionData);
    } catch (error) {
      console.error("Error in createSession:", error);
      throw error;
    }
  }

  async updateSession(id, sessionData) {
    try {
      return await PlacementSession.findByIdAndUpdate(id, sessionData, { new: true });
    } catch (error) {
      console.error("Error in updateSession:", error);
      throw error;
    }
  }

  async deleteSession(id) {
    try {
      return await PlacementSession.findByIdAndDelete(id);
    } catch (error) {
      console.error("Error in deleteSession:", error);
      throw error;
    }
  }
} 