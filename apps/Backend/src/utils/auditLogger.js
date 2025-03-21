import AuditService from "../services/auditServices.js";

const auditService = new AuditService();

export const logAudit = async (req, {
  userId = req.user?._id,
  action,
  entityType,
  entityId,
  details = {},
  changes = {}
}) => {
  try {
    return await auditService.createAuditLog({
      userId,
      action,
      entityType,
      entityId,
      details: {
        ...details,
        method: req.method,
        path: req.path
      },
      changes
    }, req);
  } catch (error) {
    console.error("Error logging audit:", error);
    return null;
  }
};

export default logAudit;
