// import { Schema as _Schema, model } from 'mongoose';
// const Schema = _Schema;
// const JNFSchema = new Schema(
//   {
//     companyDetails: {
//       name: { type: String, required: true },
//       email: { type: String, required: true },
//       website: String,
//       companyType: {
//         type: String,
//         enum: ["MNC", "Start-up", "PSU", "Private", "NGO", "Other"],
//         required: true,
//       },
//       domain: {
//         type: String,
//         enum: [
//           "Analytics",
//           "Consulting",
//           "Core(Technical)",
//           "Finance",
//           "Management",
//           "IT",
//           "Other",
//         ],
//         required: true,
//       },
//       description: String,
//     },

//     // jobProfiles: [
//     //   {
//     //     course: {
//     //       type: String,
//     //       enum: ["B.Tech", "M.Tech", "MBA", "MCA", "M.Sc", "Ph.D"],
//     //     },
//     //     designation: String,
//     //     jobDescription: String,
//     //     ctc: Number,
//     //     takeHome: Number,
//     //     perks: String,
//     //     trainingPeriod: String,
//     //     placeOfPosting: String,
//     //   },
//     // ],
//     // jobProfiles: {
//     //   type: Map,
//     //   of: [{
//     //     course: {
//     //       type: String,
//     //       enum: ["btech", "mtech", "mba", "mca", "msc", "phd"],
//     //     },
//     //     designation: String,
//     //     jobDescription: String,
//     //     ctc: Number,
//     //     takeHome: Number,
//     //     perks: String,
//     //     trainingPeriod: String,
//     //     placeOfPosting: String,
//     //   }]
//     // },


//     //changed job profile
//     jobProfiles: {
//       type: Map,
//       of: [{
//         course: {
//           type: String,
//           enum: ["btech", "mtech", "mba", "mca", "msc", "phd"],
//         },
//         designation: String,
//         jobDescription: {
//           description: String,
//           attachFile: {
//             type: Boolean,
//             default: false,
//           },
//           file: {
//             type: String, // URL or path to the file
//             required: function () {
//               return this.jobDescription.attachFile;
//             },
//           },
//         },
//         ctc: Number,
//         takeHome: Number,
//         perks: String,
//         trainingPeriod: String,
//         placeOfPosting: String,
//         jobType: {
//           type: String,
//           enum: ["fte", "fte+intern", "intern+ppo"],
//         },
//         stipend: {
//           type: Number,
//           required: function () {
//             return this.jobType === "fte+intern" || this.jobType === "intern+ppo";
//           },
//         },
//         internDuration: {
//           type: String,
//           required: function () {
//             return this.jobType === "fte+intern" || this.jobType === "intern+ppo";
//           },
//         },
//       }]
//     },

//     eligibleBranches: {
//       btech: [
//         {
//           name: {
//             type: String,
//             enum: [
//               "Computer Engineering",
//               "Information Technology",
//               "Electronics & Communication Engineering",
//               "Electrical Engineering",
//               "Mechanical Engineering",
//               "Production & Industrial Engineering",
//               "Civil Engineering",
//             ],
//           },
//           eligible: Boolean,
//         },
//       ],
//       mtech: [
//         {
//           department: String,
//           specialization: String,
//           eligible: Boolean,
//         },
//       ],
//       msc: [
//         {
//           department: String,
//           specialization: String,
//           eligible: Boolean,
//         },
//       ],
//       phd: [
//         {
//           department: String,
//           specialization: String,
//           eligible: Boolean,
//         },
//       ],
//     },

//     eligibilityCriteria: String,

//     selectionProcess: {
//       rounds: [
//         {
//           type: {
//             type: String,
//             enum: [
//               "resumeShortlisting",
//               "prePlacementTalk",
//               "groupDiscussion",
//               "onlineTest",
//               "aptitudeTest",
//               "technicalTest",
//               "technicalInterview",
//               "hrInterview",
//               "otherRounds",
//             ],
//             required: true,
//           },
//           details: String,
//         },
//       ],
//       expectedRecruits: Number,
//       tentativeDate: Date,
//     },

//     bondDetails: {
//       hasBond: {
//         type: Boolean,
//         required: true,
//       },
//       details: {
//         type: String,
//         required: function () {
//           return this.bondDetails.hasBond;
//         },
//       },
//     },


//     pointOfContact: [
//       {
//         name: String,
//         designation: String,
//         mobile: String,
//         email: String,
//       },
//     ],

//     additionalInfo: {
//       sponsorEvents: String,
//       internshipOffered: String,
//       internshipDuration: String,
//       contests: String,
//     },

//     status: {
//       type: String,
//       enum: ["draft", "submitted", "underReview", "approved", "rejected"],
//       default: "draft",
//     },

//     submittedBy: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       // required: true,
//     },

//     reviewedBy: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//     },

//     reviewComments: String,
//     submissionDate: Date,
//     reviewDate: Date,
//   },
//   { timestamps: true }
// );

// const JNF = model('JNF', JNFSchema);

// export default JNF;

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

    // Separate array for eligible branches per job profile
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

    // Separate array for selection process per job profile
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
    status: {
      type: String,
      enum: ["draft", "submitted", "underReview", "approved", "rejected"],
      default: "draft",
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
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