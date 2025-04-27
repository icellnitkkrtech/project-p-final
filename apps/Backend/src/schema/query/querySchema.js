import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const querySchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['technical', 'academic', 'placement', 'other'],
    required: true
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved'],
    default: 'pending'
  },
  responses: [{
    message: String,
    respondedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  updates: [{
    from: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Query= model('Query', querySchema);
export default Query;