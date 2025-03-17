import mongoose from "mongoose";

const placementDriveSchema = new mongoose.Schema(
  {
    placementDrive_title: { type: String, required: true },

    // Company Details
    companyDetails: {
      name: { type: String, required: true, index: true },
      email: { type: String, required: true },
      website: String,
      companyType: {
        type: String,
        enum: ["MNC", "Start-up", "PSU", "Private", "NGO", "Other"],
        required: true,
      },
      domain: {
        type: String,
        enum: [
          "Analytics",
          "Consulting",
          "Core(Technical)",
          "Finance",
          "Management",
          "IT",
          "Other",
        ],
        required: true,
      },
      description: String,
    },

    // Job Profile
    jobProfile: {
      profileId: { type: String, required: true },
      course: {
        type: String,
        enum: ["btech", "mtech", "mba", "mca", "msc", "phd"],
      },
      designation: String,
      jobDescription: {
        description: String,
        attachFile: { type: Boolean, default: false },
        file: {
          type: String,
          required: function () {
            return this.attachFile;
          },
        },
      },
      ctc: { type: Number, min: 0 },
      takeHome: Number,
      perks: String,
      trainingPeriod: String,
      placeOfPosting: String,
      jobType: {
        type: String,
        enum: ["fte", "fteIntern", "internPpo"],
      },
      stipend: {
        type: Number,
        required: function () {
          return ["fteIntern", "internPpo"].includes(this.jobType);
        },
      },
      internDuration: {
        type: String,
        required: function () {
          return ["fteIntern", "internPpo"].includes(this.jobType);
        },
      },
    },

    // Eligible Branches
    eligibleBranchesForProfiles: [
      {
        profileId: { type: String, required: true },
        branches: {
          btech: [
            {
              name: {
                type: String,
                enum: [
                  "Computer Engineering",
                  "Information Technology",
                  "Electronics & Communication Engineering",
                  "Electrical Engineering",
                  "Mechanical Engineering",
                  "Production & Industrial Engineering",
                  "Civil Engineering",
                ],
              },
              eligible: Boolean,
            },
          ],
          mtech: [{ department: String, specialization: String, eligible: Boolean }],
          msc: [{ department: String, specialization: String, eligible: Boolean }],
          phd: [{ department: String, specialization: String, eligible: Boolean }],
        },
      },
    ],

    // Selection Process
    selectionProcess: [
      {
        profileId: { type: String, required: true },
        rounds: [
          {
            roundNumber: Number,
            roundName: {
              type: String,
              enum: [
                "resumeShortlisting",
                "prePlacementTalk",
                "groupDiscussion",
                "onlineTest",
                "aptitudeTest",
                "technicalTest",
                "technicalInterview",
                "hrInterview",
                "otherRounds",
              ],
            },
            details: String,
          },
        ],
        expectedRecruits: Number,
        tentativeDate: Date,
      },
    ],

    // Eligibility Criteria
    eligibilityCriteria: {
      minCgpa: { type: Number, min: 0, max: 10 },
      backlogAllowed: { type: Number, min: 0 },
    },

    // Bond Details
    bondDetails: {
      hasBond: { type: Boolean, required: true },
      details: {
        type: String,
        required: function () {
          return this.hasBond;
        },
      },
    },

    // Point of Contact
    pointOfContact: [
      {
        name: String,
        designation: String,
        mobile: String,
        email: String,
      },
    ],

    // User Assignments
    assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Application Details
    applicationDetails: {
      applicationDeadline: { type: Date, required: true },
      applicationLink: { type: String, default: "" },
    },

    // Status & Applicants
    status: { type: String, enum: ["inProgress", "closed", "hold"], default: "inProgress" },
    applicantStudents: { type: [mongoose.Schema.Types.ObjectId], ref: "Student", default: [] },
    selectedStudents: { type: [mongoose.Schema.Types.ObjectId], ref: "Student", default: [] },

    // Rounds
    roundDetails: {
      rounds: [
        {
          roundNumber: { type: Number, required: true },
          roundName: { type: String, required: true },
          roundType: { type: String, enum: ["online", "offline"] },
          roundDate: { type: Date },
          roundDuration: { type: String },
          venue: { type: String },
          roundStatus: {
            type: String,
            enum: ["upcoming", "ongoing", "completed"],
            default: "upcoming",
          },
          applicantStudents: { type: [mongoose.Schema.Types.ObjectId], ref: "Student", default: [] },
          appearedStudents: { type: [mongoose.Schema.Types.ObjectId], ref: "Student", default: [] },
          selectedStudents: { type: [mongoose.Schema.Types.ObjectId], ref: "Student", default: [] },
          resultMessage: { type: String, default: "" },
          resultDescription: { type: String, default: "" },
        },
      ],
    },

    // Notification Logs
    notificationLogs: [
      {
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        timestamp: { type: Date, default: Date.now },
      },
    ],

    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

const placementDrive = mongoose.model("PlacementDrive", placementDriveSchema);

export default placementDrive;