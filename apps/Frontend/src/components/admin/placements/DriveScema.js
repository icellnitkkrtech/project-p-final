import mongoose from "mongoose";

const placementDriveSchema = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  placlementDriveType: { type: String, required: true }, //FULL TIME/ INTERNSHIP+FULL TIME
  companyDetails: {
    companyName: { type: String, required: true },
    companyDescription: { type: String, required: true },
    companyType: { type: String, required: true },
  },
  additionalFiles: { type: [String], default: [], optional:true}, //additional files like company ppt, studyresources pdf etc
  jobProfile:
    {
      index: { type: Number, required: true },
      jobRole: { type: String, required: true },
      aboutRole: { type: String, required: true },
      package:{
        ctc: { type: Number, required: true },
        base: { type: Number, required: true },
      },
      stipend: { type: Number, optional: true },
      stipedDuration: { type: String, optional: true },
      location: { type: Array, required: true },
      bondDetails: {type: String, optional: true},
      additionalBenefits: { type: String },
      expectedJoiningDate: { type: Date, required: true },
      eligibility: {
        program: { type: String, required: true }, //UG-B.TECH/PG/PHD
        year: { type: Number, required: true },
        eligibleBranches: {
          type: [String],
          required: true,
          enum: []
         },
        minCgpa: { type: Number, required: true, min: 0, max: 10 },
        maxbacklogs: { type: Number, required: true, min: 0 },
        otherEligibility: { type: String },
      },
      // selectionRounds: {
      //   resumeShortlisting: {
      //     index: { type: Number, required: true },
      //     value: { type: Boolean, default: false, required: true },
      //   },
      //   prePlacementTalk: {
      //     index: { type: Number, required: true },
      //     value: { type: Boolean, default: false, required: true },
      //   },
      //   resumeShortlisting: {
      //     index: { type: Number, required: true },
      //     value: { type: Boolean, default: false, required: true },
      //   },
      //   aptitudeTest: {
      //     index: { type: Number, required: true },
      //     value: { type: Boolean, default: false, required: true },
      //   },
      //   onlineTest: {
      //     index: { type: Number, required: true },
      //     value: { type: Boolean, default: false, required: true },
      //   },
      //   technicalTest: {
      //     index: { type: Number, required: true },
      //     value: { type: Boolean, default: false, required: true },
      //   },
      //   groupDiscussion: {
      //     index: { type: Number, required: true },
      //     value: { type: Boolean, default: false, required: true },
      //   },
      //   technicalInterview: {
      //     index: { type: Number, required: true },
      //     value: { type: Boolean, default: false, required: true },
      //   },
      //   hrInterview: {
      //     index: { type: Number, required: true },
      //     value: { type: Boolean, default: false, required: true },
      //   },
      //   otherRounds: {
      //     index: { type: Number, required: true },
      //     value: { type: Boolean, default: false, required: true },
      //     description: { type: String },
      //   },
      // },
    },
  applicationDetails: {
    applicationDeadline: { type: Date, required: true },
    applicationLink: { type: String, optional: true },
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  driveStatus: { type: String, default: "IN PROGRESS" },
  appliedStudents: { type: [mongoose.Schema.Types.ObjectId], ref: "Student", default: [] },
  selectedStudents: { type: [mongoose.Schema.Types.ObjectId], ref: "Student", default: [] },//will be same as selected students of last round or manually updated by pcc/admin
  rejectedStudents: { type: [mongoose.Schema.Types.ObjectId], ref: "Student", default: [] },
  appearedStudents: { type: [mongoose.Schema.Types.ObjectId], ref: "Student", default: [] },
  driveMetrics: {
    eligibleStudents: { type: Number, required: true }, //calculated based on eligibility criteria
    appliedStudents: { type: Number, default: 0 },
    appearedStudents: { type: Number, default: 0},
    selectedStudents: { type: Number, default: 0 },
    rejectedStudents: { type: Number, default: 0 },
  },
  roundDetails: {
    rounds: [ //rounds will be created based on selection rounds in job profile
      {
        index: { type: Number, required: true },
        roundName: { type: String, required: true },
        roundType: { type: String },
        roundDate: { type: Date },
        roundDuration: { type: String },
        venue: { type: String },
        roundStatus: { type: String, required: true, default: "UPCOMING" },
        applicantStudents: { type: [mongoose.Schema.Types.ObjectId], ref: "Student", default: [] },
        //applicant students for 1st round will be same as applicant students in drive and selected students for 1st round will be the eligible/applicant students for next round
        appearedStudents: { type: [mongoose.Schema.Types.ObjectId], ref: "Student", default: [] },//appeared students will be on attendence basis
        selectedStudents: { type: [mongoose.Schema.Types.ObjectId], ref: "Student", default: [] },//selected students will be on manually update by pcc/admin
        rejectedStudents: { type: [mongoose.Schema.Types.ObjectId], ref: "Student", default: [] },//automatically calculated based on appeared students
        results: {
          selectedStudents: { type: [mongoose.Schema.Types.ObjectId], ref: "Student", default: [] },
          message: { type: String, default: "Selected students for this round" },
          notifyStudents: { type: Boolean, default: true },
        },
      },
    ],
  },
}, { timestamps: true });

module.exports = mongoose.model("PlacementDrive", placementDriveSchema);
