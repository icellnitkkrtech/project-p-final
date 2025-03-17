import mongoose from "mongoose";

const studentPlacementSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  placementDrive: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlacementDrive',
    required: true
  },
  // Selected job profile from placement drive
  selectedProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlacementDrive.jobProfile',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'offer_accepted', 'joined', 'declined'],
    default: 'pending'
  },
  offerDetails: {
    offerDate: Date,
    joiningDate: Date,
    offerLetterUrl: String,
    finalPackage: Number,
    location: String
  },
  // Track student's progress through selection process
  selectionProgress: [{
    roundNumber: Number,
    roundName: String,
    status: {
      type: String,
      enum: ['pending', 'cleared', 'not_cleared'],
      default: 'pending'
    },
    date: Date,
    remarks: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp before saving
studentPlacementSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const StudentPlacement = mongoose.model('StudentPlacement', studentPlacementSchema);
export default StudentPlacement; 