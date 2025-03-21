import asyncHandler from "../../utils/asyncHandler.js";
import AuditService from "../../services/auditServices.js";
import apiResponse from "../../utils/apiResponse.js";

export default class AuditController {
  constructor() {
    this.auditService = new AuditService();
  }

  createAuditLog = asyncHandler(async (req, res) => {
    const logData = req.body;
    
    // Ensure userId is set to the current user if not provided
    if (!logData.userId && req.user) {
      logData.userId = req.user._id;
    }
    
    const result = await this.auditService.createAuditLog(logData, req);
    res.status(result.statusCode).json(result);
  });

  getAuditLogs = asyncHandler(async (req, res) => {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'timestamp', 
      sortOrder = -1,
      userId,
      action,
      entityType,
      entityId,
      startDate,
      endDate
    } = req.query;

    const filters = {
      userId,
      action,
      entityType,
      entityId,
      startDate,
      endDate
    };

    // Remove undefined filters
    Object.keys(filters).forEach(key => 
      filters[key] === undefined && delete filters[key]
    );

    const result = await this.auditService.getAuditLogs(
      filters,
      parseInt(page),
      parseInt(limit),
      sortBy,
      parseInt(sortOrder)
    );
    
    res.status(result.statusCode).json(result);
  });

  getAuditLogById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await this.auditService.getAuditLogById(id);
    res.status(result.statusCode).json(result);
  });

  getAuditActions = asyncHandler(async (req, res) => {
    const result = await this.auditService.getAuditActions();
    res.status(result.statusCode).json(result);
  });

  getAuditEntityTypes = asyncHandler(async (req, res) => {
    const result = await this.auditService.getAuditEntityTypes();
    res.status(result.statusCode).json(result);
  });
}