import AuditModel from "../models/auditModel.js";
import apiResponse from "../utils/apiResponse.js";

export default class AuditService {
  constructor() {
    this.auditModel = new AuditModel();
  }

  async createAuditLog(logData, req) {
    try {
      // Add IP and user agent information
      const enhancedLogData = {
        ...logData,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      };
      
      return await this.auditModel.createAuditLog(enhancedLogData);
    } catch (error) {
      return new apiResponse(500, null, error.message);
    }
  }

  async getAuditLogs(filters, page, limit, sortBy, sortOrder) {
    try {
      return await this.auditModel.getAuditLogs(filters, page, limit, sortBy, sortOrder);
    } catch (error) {
      return new apiResponse(500, null, error.message);
    }
  }

  async getAuditLogById(id) {
    try {
      return await this.auditModel.getAuditLogById(id);
    } catch (error) {
      return new apiResponse(500, null, error.message);
    }
  }

  async getAuditActions() {
    try {
      return await this.auditModel.getAuditActions();
    } catch (error) {
      return new apiResponse(500, null, error.message);
    }
  }

  async getAuditEntityTypes() {
    try {
      return await this.auditModel.getAuditEntityTypes();
    } catch (error) {
      return new apiResponse(500, null, error.message);
    }
  }
}
