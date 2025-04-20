import mongoose from 'mongoose';

const reportTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['placement', 'company', 'student']
  },
  metrics: [{
    type: String,
    required: true
  }],
  filters: {
    startDate: Date,
    endDate: Date,
    departments: [String],
    categories: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

reportTemplateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const ReportTemplate = mongoose.model('ReportTemplate', reportTemplateSchema);
export default ReportTemplate;