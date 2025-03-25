import mongoose from "mongoose";
import { getRecruitmentStatus } from "../../utils/companyUtils.js";

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
      rounds: [{
        roundNumber: { type: Number, required: true },
        roundName: { type: String, required: true },
        roundStatus: {
          type: String,
          enum: ['upcoming', 'ongoing', 'completed'],
          default: 'upcoming'
        },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        venue: { type: String },
        roundDurationHours: { type: Number },
        roundDurationMinutes: { type: Number },
        applicantStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
        appearedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
        selectedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
        resultMessage: { type: String },
        resultDescription: { type: String },
        resultDeclaredAt: { type: Date }
      }]
    },

    // Notification Logs
    notificationLogs: [
      {
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        timestamp: { type: Date, default: Date.now },
      },
    ],

    // Add status tracking for the overall drive
    driveStatus: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed'],
      default: 'upcoming'
    },

    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

// Middleware to automatically update round status based on time
placementDriveSchema.pre('save', function(next) {
  const now = new Date();
  
  this.roundDetails.rounds.forEach(round => {
    if (round.startTime && round.endTime) {
      if (round.startTime <= now && round.endTime >= now) {
        round.roundStatus = 'ongoing';
      } else if (round.endTime < now) {
        round.roundStatus = 'completed';
      }
    }
  });

  // Update drive status based on rounds
  const allRounds = this.roundDetails.rounds;
  if (allRounds.length > 0) {
    const lastRound = allRounds[allRounds.length - 1];
    if (lastRound.roundStatus === 'completed') {
      this.driveStatus = 'completed';
    } else if (allRounds.some(round => round.roundStatus === 'ongoing')) {
      this.driveStatus = 'ongoing';
    }
  }

  next();
});

// Add this middleware to update company status when drive status changes
placementDriveSchema.post('save', async function(doc) {
  try {
    const Company = mongoose.model('Company');
    const JNF = mongoose.model('JNF');

    // Find the associated JNF and company
    const jnf = await JNF.findOne({ placementDrive: doc._id });
    if (jnf && jnf.company) {
      const company = await Company.findById(jnf.company).populate({
        path: 'JNFs',
        populate: {
          path: 'placementDrive'
        }
      });
      
      if (company) {
        // Update company recruitment status
        const recruitmentStatus = getRecruitmentStatus(company);
        await Company.findByIdAndUpdate(jnf.company, { recruitmentStatus });
      }
    }
  } catch (error) {
    console.error('Error updating company recruitment status:', error);
  }
});

const placementDrive = mongoose.model("PlacementDrive", placementDriveSchema);

export default placementDrive;