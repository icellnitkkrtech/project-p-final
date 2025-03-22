import { Router } from "express";
import AuditController from "../controllers/admin/auditController.js";
// Fix the path to the middleware files
import authVerify from "../middlewares/auth.middlewares.js"; 
import adminVerify from "../middlewares/admin.middlewares.js"; 

const auditRouter = Router();
const auditController = new AuditController();

// Create audit log - accessible by any authenticated user
auditRouter.post("/", authVerify, (req, res) => {
  auditController.createAuditLog(req, res);
});

// Get audit logs - admin only
auditRouter.get("/", authVerify, adminVerify, (req, res) => {
  auditController.getAuditLogs(req, res);
});

// Get audit log by ID - admin only
auditRouter.get("/:id", authVerify, adminVerify, (req, res) => {
  auditController.getAuditLogById(req, res);
});

// Get available audit actions - admin only
auditRouter.get("/metadata/actions", authVerify, adminVerify, (req, res) => {
  auditController.getAuditActions(req, res);
});

// Get available entity types - admin only
auditRouter.get("/metadata/entity-types", authVerify, adminVerify, (req, res) => {
  auditController.getAuditEntityTypes(req, res);
});

export default auditRouter; 