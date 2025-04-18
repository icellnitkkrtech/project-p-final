import * as placementPolicyService from '../services/placementPolicyService.js';

// Helper function to handle async routes
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const getAllPolicies = asyncHandler(async (req, res) => {
  const policies = await placementPolicyService.getAllPolicies();
  return res.status(200).json({
    success: true,
    data: policies,
    message: "Placement policies retrieved successfully"
  });
});

export const getPolicyById = asyncHandler(async (req, res) => {
  const { policyId } = req.params;
  const policy = await placementPolicyService.getPolicyById(policyId);
  return res.status(200).json({
    success: true,
    data: policy,
    message: "Placement policy retrieved successfully"
  });
});

export const createPolicy = asyncHandler(async (req, res) => {
  const policyData = req.body;
  
  // Check if req.user exists, if not use a default admin ID or null
  const adminId = req.user ? req.user._id : null;
  
  // Log for debugging
  console.log("Creating policy with admin ID:", adminId);
  console.log("Policy data:", policyData);
  
  const newPolicy = await placementPolicyService.createPolicy(policyData, adminId);
  return res.status(201).json({
    success: true,
    data: newPolicy,
    message: "Placement policy created successfully"
  });
});

export const updatePolicy = asyncHandler(async (req, res) => {
  const { policyId } = req.params;
  const policyData = req.body;
  
  // Check if req.user exists, if not use a default admin ID or null
  const adminId = req.user ? req.user._id : null;
  
  const updatedPolicy = await placementPolicyService.updatePolicy(policyId, policyData, adminId);
  return res.status(200).json({
    success: true,
    data: updatedPolicy,
    message: "Placement policy updated successfully"
  });
});

export const deletePolicy = asyncHandler(async (req, res) => {
  const { policyId } = req.params;
  const result = await placementPolicyService.deletePolicy(policyId);
  return res.status(200).json({
    success: true,
    data: result,
    message: "Placement policy deleted successfully"
  });
});

export const checkStudentEligibility = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { branchId, courseId } = req.query;
  
  const eligibility = await placementPolicyService.checkStudentEligibility(studentId, branchId, courseId);
  return res.status(200).json({
    success: true,
    data: eligibility,
    message: "Student eligibility checked successfully"
  });
}); 