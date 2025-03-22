import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const ApplicationSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    placementDrive: {
      type: Schema.Types.ObjectId,
      ref: "PlacementDrive",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "applied",
        "shortlisted",
        "in-process",
        "selected",
        "rejected",
        "on-hold",
      ],
      default: "applied",
    },
    roundStatus: [
      {
        roundNumber: Number,
        roundName: String,
        status: {
          type: String,
          enum: ["pending", "qualified", "not-qualified", "absent"],
          default: "pending",
        },
        feedback: String,
        date: { type: Date, default: Date.now },
        interviewer: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    timeline: [
      {
        status: String,
        date: { type: Date, default: Date.now },
        remarks: String,
        updatedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    documents: [
      {
        name: String,
        type: {
          type: String,
          enum: ["resume", "offer_letter", "other"],
        },
        url: String,
        verified: {
          type: Boolean,
          default: false,
        },
        verifiedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    offerDetails: {
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "withdrawn"],
        default: "pending",
      },
      ctc: Number,
      takeHome: Number,
      joiningDate: Date,
      location: String,
      offerLetter: String,
      bondDetails: String,
    },
    feedback: String,
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
const Application = model("Application", ApplicationSchema);
export { Application };
