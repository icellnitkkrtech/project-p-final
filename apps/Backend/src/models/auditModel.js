import AuditLog from "../schema/admin/auditLogSchema.js";
import apiResponse from "../utils/apiResponse.js";

export default class AuditModel {
  auditLog = AuditLog;

  async createAuditLog(logData) {
    try {
      const newLog = await this.auditLog.create(logData);
      return new apiResponse(201, newLog, "Audit log created successfully");
    } catch (error) {
      return new apiResponse(500, null, error.message);
    }
  }

  async getAuditLogs(filters = {}, page = 1, limit = 10, sortBy = 'timestamp', sortOrder = -1) {
    try {
      const skip = (page - 1) * limit;
      const sort = {};
      sort[sortBy] = sortOrder;

      const query = {};
      
      // Apply filters
      if (filters.userId) query.userId = filters.userId;
      if (filters.action) query.action = filters.action;
      if (filters.entityType) query.entityType = filters.entityType;
      if (filters.entityId) query.entityId = filters.entityId;
      if (filters.startDate && filters.endDate) {
        query.timestamp = {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate)
        };
      }

      const logs = await this.auditLog
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('userId', 'email user_role userRoleAsAdmin');

      const total = await this.auditLog.countDocuments(query);

      return new apiResponse(200, {
        logs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }, "Audit logs fetched successfully");
    } catch (error) {
      return new apiResponse(500, null, error.message);
    }
  }

  async getAuditLogById(id) {
    try {
      const log = await this.auditLog
        .findById(id)
        .populate('userId', 'email user_role userRoleAsAdmin');
      
      if (!log) {
        return new apiResponse(404, null, "Audit log not found");
      }
      
      return new apiResponse(200, log, "Audit log fetched successfully");
    } catch (error) {
      return new apiResponse(500, null, error.message);
    }
  }

  async getAuditActions() {
    try {
      const actions = await this.auditLog.distinct('action');
      return new apiResponse(200, actions, "Audit actions fetched successfully");
    } catch (error) {
      return new apiResponse(500, null, error.message);
    }
  }

  async getAuditEntityTypes() {
    try {
      const entityTypes = await this.auditLog.distinct('entityType');
      return new apiResponse(200, entityTypes, "Entity types fetched successfully");
    } catch (error) {
      return new apiResponse(500, null, error.message);
    }
  }
}
