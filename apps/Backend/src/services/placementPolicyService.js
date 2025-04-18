import PlacementPolicy from '../models/placementPolicyModel.js';

export const getAllPolicies = async () => {
  try {
    const policies = await PlacementPolicy.find().sort({ createdAt: -1 });
    return policies;
  } catch (error) {
    throw new Error('Error fetching placement policies: ' + error.message);
  }
};

export const getPolicyById = async (policyId) => {
  try {
    const policy = await PlacementPolicy.findById(policyId);
    if (!policy) {
      const error = new Error('Placement policy not found');
      error.statusCode = 404;
      throw error;
    }
    return policy;
  } catch (error) {
    if (error.name === 'CastError') {
      const castError = new Error('Invalid policy ID format');
      castError.statusCode = 400;
      throw castError;
    }
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    throw error;
  }
};

export const createPolicy = async (policyData, adminId) => {
  try {
    // Create policy data object, only including adminId if it exists
    const policyDataToSave = {
      ...policyData
    };
    
    // Only add createdBy and updatedBy if adminId exists
    if (adminId) {
      policyDataToSave.createdBy = adminId;
      policyDataToSave.updatedBy = adminId;
    }
    
    const newPolicy = new PlacementPolicy(policyDataToSave);
    
    await newPolicy.validate();
    const savedPolicy = await newPolicy.save();
    return savedPolicy;
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationError = new Error(error.message);
      validationError.statusCode = 400;
      throw validationError;
    }
    const serverError = new Error('Error creating placement policy: ' + error.message);
    serverError.statusCode = 500;
    throw serverError;
  }
};

export const updatePolicy = async (policyId, policyData, adminId) => {
  try {
    const policy = await PlacementPolicy.findById(policyId);
    if (!policy) {
      const error = new Error('Placement policy not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Create update data object
    const updateData = { ...policyData };
    
    // Only add updatedBy if adminId exists
    if (adminId) {
      updateData.updatedBy = adminId;
    }
    
    const updatedPolicy = await PlacementPolicy.findByIdAndUpdate(
      policyId,
      updateData,
      { new: true, runValidators: true }
    );
    
    return updatedPolicy;
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationError = new Error(error.message);
      validationError.statusCode = 400;
      throw validationError;
    }
    if (error.name === 'CastError') {
      const castError = new Error('Invalid policy ID format');
      castError.statusCode = 400;
      throw castError;
    }
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    throw error;
  }
};

export const deletePolicy = async (policyId) => {
  try {
    const policy = await PlacementPolicy.findById(policyId);
    if (!policy) {
      const error = new Error('Placement policy not found');
      error.statusCode = 404;
      throw error;
    }
    
    await PlacementPolicy.findByIdAndDelete(policyId);
    return { success: true, message: 'Policy deleted successfully' };
  } catch (error) {
    if (error.name === 'CastError') {
      const castError = new Error('Invalid policy ID format');
      castError.statusCode = 400;
      throw castError;
    }
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    throw error;
  }
};

export const checkStudentEligibility = async (studentId, branchId, courseId) => {
  try {
    // This would be expanded to include actual logic to check student's placement status
    // against active policies and determine eligibility
    
    // For now, returning a placeholder response
    return {
      eligible: true,
      restrictedTo: null,
      policies: []
    };
  } catch (error) {
    const serverError = new Error('Error checking student eligibility: ' + error.message);
    serverError.statusCode = 500;
    throw serverError;
  }
}; 