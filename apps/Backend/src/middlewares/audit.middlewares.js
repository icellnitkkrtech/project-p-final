import asyncHandler from "../utils/asyncHandler.js";
import AuditService from "../services/auditServices.js";

const auditService = new AuditService();

export const auditLog = (action, entityType, getEntityId) => {
  return asyncHandler(async (req, res, next) => {
    // Store the original send method
    const originalSend = res.send;
    
    // Override the send method
    res.send = function(data) {
      // Only log successful operations (status 2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const userId = req.user?._id;
          const entityId = typeof getEntityId === 'function' 
            ? getEntityId(req, res, data) 
            : (req.params.id || req.body.id);
          
          // Determine what changed
          let changes = {};
          if (req.method === 'PUT' || req.method === 'PATCH') {
            changes = {
              before: req.originalEntity, // This would need to be set by a previous middleware
              after: req.body
            };
          }
          
          // Create the audit log
          auditService.createAuditLog({
            userId,
            action,
            entityType,
            entityId,
            details: {
              method: req.method,
              path: req.path,
              body: req.body,
              query: req.query,
              params: req.params
            },
            changes
          }, req);
        } catch (error) {
          console.error("Error creating audit log:", error);
        }
      }
      
      // Call the original send method
      return originalSend.call(this, data);
    };
    
    next();
  });
};

export default auditLog;
