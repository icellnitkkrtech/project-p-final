import express from 'express';
import * as placementPolicyController from '../controllers/placementPolicyController.js';
// import { verifyJWT } from '../middlewares/auth.middleware.js';
// import { isAdmin } from '../middlewares/role.middleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
// router.use(verifyJWT);

// Admin-only routes
router.route('/')
  .get( placementPolicyController.getAllPolicies)
  .post( placementPolicyController.createPolicy);

router.route('/:policyId')
  .get( placementPolicyController.getPolicyById)
  .put( placementPolicyController.updatePolicy)
  .delete( placementPolicyController.deletePolicy);

// Route to check student eligibility - can be accessed by admins and TPOs
router.get('/student/:studentId/eligibility', placementPolicyController.checkStudentEligibility);

export default router; 