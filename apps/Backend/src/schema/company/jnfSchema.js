import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const JNFSchema = new Schema(
  {
    companyDetails: {
      name: { 
        type: String, 
        required: true, // Always required
        trim: true
      },
      email: { 
        type: String, 
        required: true, // Always required
        trim: true,
        validate: {
          validator: function(v) {
            return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
          },
          message: 'Please enter a valid email'
        }
      },
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
        enum: ["fte", "fteIntern", "internPpo"],
      },
      stipend: {
        type: Number,
        required: function () {
          return this.jobType === "fteIntern" || this.jobType === "internPpo";
        },
      },
      internDuration: {
        type: String,
        required: function () {
          return this.jobType === "fteIntern" || this.jobType === "internPpo";
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
            department: {
              type: String,
              enum: [
                "Computer Engineering",
                "Electronics and Communication Engineering",
                "Electrical Engineering",
                "Mechanical Engineering",
                "Civil Engineering",
                "Physics",
                "Master of Computer Applications (MCA)",
                "School of Renewable Energy and Efficiency",
                "School of VLSI Design & Embedded System",
                "Master of Business Administration (MBA)"
              ],
            },
            specialization: {
              type: String,
              enum: [
                "Cyber Security",
                "Communication Systems",
                "Power System",
                "Power Electronics & Drives",
                "Control System",
                "Thermal Engineering",
                "Machine Design",
                "Production & Industrial Engineering",
                "Environmental Engineering",
                "Water Resources Engineering",
                "Transportation Engineering",
                "Structural Engineering",
                "Geotechnical Engineering",
                "Instrumentation",
                "Nanomaterials and Nanotechnology",
                "Master of Computer Applications (MCA)",
                "Renewable Energy Systems",
                "VLSI Design",
                "Embedded System Design",
                "Master of Business Administration (MBA)"
              ],
            },
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
            roundNumber: Number,
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
   
    eligibilityCriteria: {
	    minCgpa: Number, //limit from 0-10
	    backlogAllowed: Number, //min 0
    },
    bondDetails: {
      hasBond: {
        type: Boolean,
        required: true,
      },
      details: {
        type: String,
        required: function () {
          return this.hasBond;
        },
      }
    },
    pointOfContact: [
      {
        name: String,
        designation: String,
        mobile: String,
        email: String,
      },
    ],
    assignedUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    additionalInfo: {
      sponsorEvents: String,
      internshipOffered: String,
      internshipDuration: String,
      contests: String,
    },
    status: {
      type: String,
      enum: ["draft", "submitted", "pending", "approved", "rejected"],
      default: "pending",
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    placementDrive: {
      type: Schema.Types.ObjectId,
      ref: 'PlacementDrive'
  },
    reviewComments: String,
    submissionDate: Date,
    reviewDate: Date,
  },
  { 
    timestamps: true,
    validateBeforeSave: true // Enable validation by default
  }
);

// Pre-save middleware to handle draft validation
JNFSchema.pre('save', function(next) {
  if (this.status === 'draft') {
    // Only validate required fields for drafts
    if (!this.companyDetails.name || !this.companyDetails.email) {
      next(new Error('Company name and email are required even for drafts'));
      return;
    }
  }
  next();
});

// Add custom validation method
JNFSchema.methods.validateDraft = function() {
  const errors = [];
  
  // Minimal validation for drafts
  if (!this.companyDetails?.name) {
    errors.push('Company name is required even for drafts');
  }

  if (this.companyDetails?.email && 
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.companyDetails.email)) {
    errors.push('Invalid email format');
  }

  return errors;
};

// Add static method to save drafts
JNFSchema.statics.saveDraft = async function(draftData) {
  const jnf = new this(draftData);
  jnf.status = 'draft';
  
  // Validate draft
  const errors = jnf.validateDraft();
  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }

  return await jnf.save();
};

const JNF = model('JNF', JNFSchema);
export default JNF;