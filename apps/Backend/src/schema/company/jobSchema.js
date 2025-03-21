import { Schema as _Schema, model,mongoose } from 'mongoose';
const Schema = _Schema;

const JobSchema = new Schema(
    {
      course: {
        type: String,
        enum: ["B.Tech", "M.Tech", "MBA", "MCA", "M.Sc", "Ph.D"],
      },

      departments: {
        type: [String], 
        required: true,
      },

      designation: String,
      jobDescription: String,
      eligibilityCriteria: String,
      ctc: Number,
      takeHome: Number,
      perks: String,
      trainingPeriod: String,
      placeOfPosting: String,
  
      jnf: {
        type: Schema.Types.ObjectId,
        ref: "JNF",
        required: true,
      },
  
      status: {
        type: String,
        enum: ["pendingAdminApproval", "open", "closed"],
        default: "pendingAdminApproval",
      },
  
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
  
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
  );


const Job = model('Job', JobSchema);

export default Job;