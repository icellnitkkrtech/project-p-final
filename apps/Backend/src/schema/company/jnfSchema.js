import mongoose from 'mongoose';
import { getRecruitmentStatus } from "../../utils/companyUtils.js";

const jnfSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  companyDetails: {
    name: { type: String, required: true },
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

  jobProfiles: [{
    profileId: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      enum: ["btech", "mtech", "mba", "mca", "msc", "phd"],
    },
    designation: String,
    jobDescription: {
      description: String,
      attachFile: {
        type: Boolean,
        default: false,
      },
      file: {
        type: String,
        required: function () {
          return this.jobDescription.attachFile;
        },
      },
    },
    ctc: Number,
    takeHome: Number,
    perks: String,
    trainingPeriod: String,
    placeOfPosting: String,
    jobType: {
      type: String,
      enum: ["fte", "fte+intern", "intern+ppo"],
    },
    stipend: {
      type: Number,
      required: function () {
        return this.jobType === "fte+intern" || this.jobType === "intern+ppo";
      },
    },
    internDuration: {
      type: String,
      required: function () {
        return this.jobType === "fte+intern" || this.jobType === "intern+ppo";
      },
    },
  }],

  eligibleBranchesForProfiles: [{
    profileId: {
      type: String,
      required: true,
    },
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
      mtech: [
        {
          department: String,
          specialization: String,
          eligible: Boolean,
        },
      ],
      msc: [
        {
          department: String,
          specialization: String,
          eligible: Boolean,
        },
      ],
      phd: [
        {
          department: String,
          specialization: String,
          eligible: Boolean,
        },
      ],
    },
  }],

  selectionProcessForProfiles: [{
    profileId: {
      type: String,
      required: true,
    },
    rounds: [
      {
        type: {
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
          required: true,
        },
        details: String,
      },
    ],
    expectedRecruits: Number,
    tentativeDate: Date,
  }],

  eligibilityCriteria: String,
  bondDetails: {
    hasBond: {
      type: Boolean,
      required: true,
    },
    details: {
      type: String,
      required: function () {
        return this.bondDetails.hasBond;
      },
    },
  },
  pointOfContact: [
    {
      name: String,
      designation: String,
      mobile: String,
      email: String,
    },
  ],
  additionalInfo: {
    sponsorEvents: String,
    internshipOffered: String,
    internshipDuration: String,
    contests: String,
  },
  placementDrive: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlacementDrive'
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'rejected', 'completed'],
    default: 'draft'
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reviewComments: String,
  submissionDate: Date,
  reviewDate: Date,
}, { timestamps: true });

// Add middleware to update company recruitment status
jnfSchema.post('save', async function(doc) {
  try {
    const Company = mongoose.model('Company');
    const company = await Company.findById(doc.company).populate({
      path: 'JNFs',
      populate: {
        path: 'placementDrive'
      }
    });
    
    if (company) {
      // Update company recruitment status based on JNF and drive status
      const recruitmentStatus = getRecruitmentStatus(company);
      await Company.findByIdAndUpdate(doc.company, { recruitmentStatus });
    }
  } catch (error) {
    console.error('Error updating company recruitment status:', error);
  }
});

export default mongoose.model('JNF', jnfSchema);