import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const AuditLogSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  action: { 
    type: String, 
    required: true 
  },
  entityType: { 
    type: String, 
    required: true 
  },
  entityId: { 
    type: Schema.Types.ObjectId, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  ipAddress: { 
    type: String 
  },
  userAgent: { 
    type: String 
  },
  details: { 
    type: Object 
  },
  changes: {
    before: { type: Object },
    after: { type: Object }
  }
}, { timestamps: true });

const AuditLog = model('AuditLog', AuditLogSchema);

export default AuditLog;
