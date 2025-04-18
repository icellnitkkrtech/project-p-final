import mongoose from 'mongoose';

const placementPolicySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Policy name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  policyType: {
    type: String,
    enum: ['placement_percentage', 'placement_count', 'cgpa_threshold', 'custom'],
    default: 'placement_percentage'
  },
  threshold: {
    type: Number,
    required: [true, 'Threshold value is required'],
    min: 0,
    // Use a static max value instead of a function
    max: 100
  },
  eligibleFor: {
    type: String,
    enum: ['psu_only', 'all_drives', 'no_drives', 'custom_companies'],
    default: 'psu_only'
  },
  customCompanyTypes: {
    type: [String],
    default: []
  },
  appliesTo: {
    courses: {
      type: [String],
      default: ['btech', 'mtech', 'phd']
    },
    branches: {
      type: [String],
      default: []
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

// Add validation at the document level instead
placementPolicySchema.pre('validate', function(next) {
  if (this.policyType === 'placement_percentage' && this.threshold > 100) {
    this.invalidate('threshold', 'Percentage threshold cannot exceed 100');
  }
  next();
});

// Add index for faster queries
placementPolicySchema.index({ policyType: 1, isActive: 1 });

export default placementPolicySchema; 