import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;
const JNFSchema = new Schema(
  {
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

    jobProfiles: [
      {
        course: {
          type: String,
          enum: ["B.Tech", "M.Tech", "MBA", "MCA", "M.Sc", "Ph.D"],
        },
        designation: String,
        jobDescription: String,
        ctc: Number,
        takeHome: Number,
        perks: String,
        trainingPeriod: String,
        placeOfPosting: String,
      },
    ],

    eligibleBranches: {
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

    eligibilityCriteria: String,

    selectionProcess: {
      resumeShortlisting: Boolean,
      prePlacementTalk: Boolean,
      groupDiscussion: Boolean,
      onlineTest: Boolean,
      aptitudeTest: Boolean,
      technicalTest: Boolean,
      technicalInterview: Boolean,
      hrInterview: Boolean,
      otherRounds: String,
      expectedRecruits: Number,
      tentativeDate: Date,
    },

    bondDetails: String,

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

    status: {
      type: String,
      enum: ["draft", "submitted", "underReview", "approved", "rejected"],
      default: "draft",
    },

    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    reviewComments: String,
    submissionDate: Date,
    reviewDate: Date,
  },
  { timestamps: true }
);

const JNF = model('JNF', JNFSchema);

export default JNF;