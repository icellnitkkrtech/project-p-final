import React from "react";

const jnfDetails = [
    {
      id: 1,
      // companyDetails: {
        name: 'Tech Solutions Inc.',
        email: 'hr@techsolutions.com',
        website: 'www.techsolutions.com',
        companyType: 'MNC',
        domain: 'IT',
        description: 'Develop and maintain software solutions.',
      // },
      jobProfiles: [
        {
          course: 'B.Tech',
          designation: 'Software Developer',
          jobDescription: 'Develop and maintain software solutions.',
          ctc: 1000000,
          takeHome: 800000,
          perks: 'Health Insurance, Stock Options',
          trainingPeriod: '6 months',
          placeOfPosting: 'Bangalore'
        }
      ],
      eligibleBranches: {
        btech: [
          { name: 'Computer Engineering', eligible: true },
          { name: 'Information Technology', eligible: true }
        ],
        mtech: [
          { department: 'CSE', specialization: 'AI', eligible: true }
        ]
      },
      eligibilityCriteria: 'Minimum 7 CGPA',
      selectionProcess: {
        resumeShortlisting: true,
        prePlacementTalk: true,
        groupDiscussion: false,
        onlineTest: true,
        aptitudeTest: true,
        technicalTest: true,
        technicalInterview: true,
        hrInterview: true,
        otherRounds: 'Coding Challenge',
        expectedRecruits: 10,
        tentativeDate: '2024-06-15'
      },
      bondDetails: '2 years bond, penalty of 1 LPA',
      pointOfContact: [
        {
          name: 'John Doe',
          designation: 'HR Manager',
          mobile: '9876543210',
          email: 'john.doe@techsolutions.com'
        }
      ],
      additionalInfo: {
        sponsorEvents: 'Yes',
        internshipOffered: 'Yes',
        internshipDuration: '2 months',
        contests: 'Hackathon Sponsorship'
      },
      status: 'pending',
      acceptedBy: '',
      reviewComments: '',
      reviewDate: '',
      assignedUser:
        { name: 'Yash', email: 'yash@530.com',designation: 'ICC'},
      assignedDate: '10-10-2021,10:30:00 a.m.',
      assignedBy: 'admin123',
      driveStatus: 'new',
    },
    {
      id: 2,
      // companyDetails: {
        name: 'Innovatech Pvt Ltd',
        email: 'contact@innovatech.com',
        website: 'www.innovatech.com',
        companyType: 'Start-up',
        domain: 'Analytics',
        description: 'Analyze datasets and provide actionable insights.',
      // },
      jobProfiles: [
        {
          course: 'M.Tech',
          designation: 'Data Analyst',
          jobDescription: 'Analyze datasets and generate reports.',
          ctc: 1000000,
          takeHome: 850000,
          perks: 'Flexible hours, Stock Options',
          trainingPeriod: '3 months',
          placeOfPosting: 'Hyderabad'
        }
      ],
      eligibleBranches: {
        btech: [
          { name: 'Computer Engineering', eligible: true },
          { name: 'Mechanical Engineering', eligible: false }
        ],
        mtech: [
          { department: 'ECE', specialization: 'VLSI', eligible: true }
        ]
      },
      eligibilityCriteria: 'Minimum 6.5 CGPA',
      selectionProcess: {
        resumeShortlisting: true,
        prePlacementTalk: false,
        groupDiscussion: true,
        onlineTest: true,
        aptitudeTest: false,
        technicalTest: true,
        technicalInterview: true,
        hrInterview: false,
        otherRounds: 'Case Study',
        expectedRecruits: 5,
        tentativeDate: '2024-07-10'
      },
      bondDetails: 'No bond',
      pointOfContact: [
        {
          name: 'Jane Smith',
          designation: 'Recruitment Lead',
          mobile: '9876541230',
          email: 'jane.smith@innovatech.com'
        }
      ],
      additionalInfo: {
        sponsorEvents: 'No',
        internshipOffered: 'Yes',
        internshipDuration: '1 month',
        contests: 'Coding Bootcamp'
      },
      status: 'pending',
      acceptedBy: '',
      reviewComments: '',
      reviewDate: '',
      assignedUser:
        { name: 'Yash', email: 'yash@530.com',designation: 'ICC'},
      assignedDate: '10-10-2021,10:30:00 a.m.',
      assignedBy: 'admin123',
      driveStatus: 'new',
    },
    {
        id: 3,
        // companyDetails: {
          name: 'Tech Solutions Inc.',
          email: 'hr@techsolutions.com',
          website: 'www.techsolutions.com',
          companyType: 'MNC',
          domain: 'IT',
          description: 'Develop and maintain software solutions.',
        // },
        jobProfiles: [
          {
            course: 'B.Tech',
            designation: 'Software Developer',
            jobDescription: 'Develop and maintain software solutions.',
            ctc: 1000000,
            takeHome: 800000,
            perks: 'Health Insurance, Stock Options',
            trainingPeriod: '6 months',
            placeOfPosting: 'Bangalore'
          }
        ],
        eligibleBranches: {
          btech: [
            { name: 'Computer Engineering', eligible: true },
            { name: 'Information Technology', eligible: true }
          ],
          mtech: [
            { department: 'CSE', specialization: 'AI', eligible: true }
          ]
        },
        eligibilityCriteria: 'Minimum 7 CGPA',
        selectionProcess: {
          resumeShortlisting: true,
          prePlacementTalk: true,
          groupDiscussion: false,
          onlineTest: true,
          aptitudeTest: true,
          technicalTest: true,
          technicalInterview: true,
          hrInterview: true,
          otherRounds: 'Coding Challenge',
          expectedRecruits: 10,
          tentativeDate: '2024-06-15'
        },
        bondDetails: '2 years bond, penalty of 1 LPA',
        pointOfContact: [
          {
            name: 'John Doe',
            designation: 'HR Manager',
            mobile: '9876543210',
            email: 'john.doe@techsolutions.com'
          }
        ],
        additionalInfo: {
          sponsorEvents: 'Yes',
          internshipOffered: 'Yes',
          internshipDuration: '2 months',
          contests: 'Hackathon Sponsorship'
        },
        status: 'pending',
        acceptedBy: '',
        reviewComments: '',
        reviewDate: '',
        assignedUser:
          { name: 'Yash', email: 'yash@530.com',designation: 'ICC'},
        assignedDate: '10-10-2021,10:30:00 a.m.',
        assignedBy: 'admin123',
        driveStatus: 'completed',
      },
      {
        id: 4,
        // companyDetails: {
          name: 'Innovatech Pvt Ltd',
          email: 'contact@innovatech.com',
          website: 'www.innovatech.com',
          companyType: 'Start-up',
          domain: 'Analytics',
          description: 'Analyze datasets and provide actionable insights.',
        // },
        jobProfiles: [
          {
            course: 'M.Tech',
            designation: 'Data Analyst',
            jobDescription: 'Analyze datasets and generate reports.',
            ctc: 1000000,
            takeHome: 850000,
            perks: 'Flexible hours, Stock Options',
            trainingPeriod: '3 months',
            placeOfPosting: 'Hyderabad'
          }
        ],
        eligibleBranches: {
          btech: [
            { name: 'Computer Engineering', eligible: true },
            { name: 'Mechanical Engineering', eligible: false }
          ],
          mtech: [
            { department: 'ECE', specialization: 'VLSI', eligible: true }
          ]
        },
        eligibilityCriteria: 'Minimum 6.5 CGPA',
        selectionProcess: {
          resumeShortlisting: true,
          prePlacementTalk: false,
          groupDiscussion: true,
          onlineTest: true,
          aptitudeTest: false,
          technicalTest: true,
          technicalInterview: true,
          hrInterview: false,
          otherRounds: 'Case Study',
          expectedRecruits: 5,
          tentativeDate: '2024-07-10'
        },
        bondDetails: 'No bond',
        pointOfContact: [
          {
            name: 'Jane Smith',
            designation: 'Recruitment Lead',
            mobile: '9876541230',
            email: 'jane.smith@innovatech.com'
          }
        ],
        additionalInfo: {
          sponsorEvents: 'No',
          internshipOffered: 'Yes',
          internshipDuration: '1 month',
          contests: 'Coding Bootcamp'
        },
        status: 'accepted',
        acceptedBy: 'user789',
        reviewComments: '',
        reviewDate: '2024-04-20',
        assignedUser:
          { name: 'Yash', email: 'yash@530.com',designation: 'ICC'},
        assignedDate: '10-10-2021,10:30:00 a.m.',
        assignedBy: 'admin123',
        driveStatus: 'completed',
      },{
        id: 5,
        // companyDetails: {
          name: 'Tech Solutions Inc.',
          email: 'hr@techsolutions.com',
          website: 'www.techsolutions.com',
          companyType: 'MNC',
          domain: 'IT',
          description: 'Develop and maintain software solutions.',
        // },
        jobProfiles: [
          {
            course: 'B.Tech',
            designation: 'Software Developer',
            jobDescription: 'Develop and maintain software solutions.',
            ctc: 1000000,
            takeHome: 800000,
            perks: 'Health Insurance, Stock Options',
            trainingPeriod: '6 months',
            placeOfPosting: 'Bangalore'
          }
        ],
        eligibleBranches: {
          btech: [
            { name: 'Computer Engineering', eligible: true },
            { name: 'Information Technology', eligible: true }
          ],
          mtech: [
            { department: 'CSE', specialization: 'AI', eligible: true }
          ]
        },
        eligibilityCriteria: 'Minimum 7 CGPA',
        selectionProcess: {
          resumeShortlisting: true,
          prePlacementTalk: true,
          groupDiscussion: false,
          onlineTest: true,
          aptitudeTest: true,
          technicalTest: true,
          technicalInterview: true,
          hrInterview: true,
          otherRounds: 'Coding Challenge',
          expectedRecruits: 10,
          tentativeDate: '2024-06-15'
        },
        bondDetails: '2 years bond, penalty of 1 LPA',
        pointOfContact: [
          {
            name: 'John Doe',
            designation: 'HR Manager',
            mobile: '9876543210',
            email: 'john.doe@techsolutions.com'
          }
        ],
        additionalInfo: {
          sponsorEvents: 'Yes',
          internshipOffered: 'Yes',
          internshipDuration: '2 months',
          contests: 'Hackathon Sponsorship'
        },
        status: 'accepted',
        acceptedBy: 'user789',
        reviewComments: '',
        reviewDate: '2024-04-20',
        assignedUser:
          { name: 'Yash', email: 'yash@530.com',designation: 'ICC'},
        assignedDate: '10-10-2021,10:30:00 a.m.',
        assignedBy: 'admin123',
        driveStatus: 'ongoing',
      },
      {
        id: 6,
        // companyDetails: {
          name: 'Innovatech Pvt Ltd',
          email: 'contact@innovatech.com',
          website: 'www.innovatech.com',
          companyType: 'Start-up',
          domain: 'Analytics',
          description: 'Analyze datasets and provide actionable insights.',
        // },
        jobProfiles: [
          {
            course: 'M.Tech',
            designation: 'Data Analyst',
            jobDescription: 'Analyze datasets and generate reports.',
            ctc: 1000000,
            takeHome: 850000,
            perks: 'Flexible hours, Stock Options',
            trainingPeriod: '3 months',
            placeOfPosting: 'Hyderabad'
          }
        ],
        eligibleBranches: {
          btech: [
            { name: 'Computer Engineering', eligible: true },
            { name: 'Mechanical Engineering', eligible: false }
          ],
          mtech: [
            { department: 'ECE', specialization: 'VLSI', eligible: true }
          ]
        },
        eligibilityCriteria: 'Minimum 6.5 CGPA',
        selectionProcess: {
          resumeShortlisting: true,
          prePlacementTalk: false,
          groupDiscussion: true,
          onlineTest: true,
          aptitudeTest: false,
          technicalTest: true,
          technicalInterview: true,
          hrInterview: false,
          otherRounds: 'Case Study',
          expectedRecruits: 5,
          tentativeDate: '2024-07-10'
        },
        bondDetails: 'No bond',
        pointOfContact: [
          {
            name: 'Jane Smith',
            designation: 'Recruitment Lead',
            mobile: '9876541230',
            email: 'jane.smith@innovatech.com'
          }
        ],
        additionalInfo: {
          sponsorEvents: 'No',
          internshipOffered: 'Yes',
          internshipDuration: '1 month',
          contests: 'Coding Bootcamp'
        },
        status: 'accepted',
        acceptedBy: 'user789',
        reviewComments: '',
        reviewDate: '2024-04-20',
        assignedUser:
          { name: 'Yash', email: 'yash@530.com',designation: 'ICC'},
        assignedDate: '10-10-2021,10:30:00 a.m.',
        assignedBy: 'admin123',
        driveStatus: 'new',
      },
      {
        id: 7,
        // companyDetails: {
          name: 'Tech Solutions Inc.',
          email: 'hr@techsolutions.com',
          website: 'www.techsolutions.com',
          companyType: 'MNC',
          domain: 'IT',
          description: 'Develop and maintain software solutions.',
        // },
        jobProfiles: [
          {
            course: 'B.Tech',
            designation: 'Software Developer',
            jobDescription: 'Develop and maintain software solutions.',
            ctc: 1000000,
            takeHome: 800000,
            perks: 'Health Insurance, Stock Options',
            trainingPeriod: '6 months',
            placeOfPosting: 'Bangalore'
          }
        ],
        eligibleBranches: {
          btech: [
            { name: 'Computer Engineering', eligible: true },
            { name: 'Information Technology', eligible: true }
          ],
          mtech: [
            { department: 'CSE', specialization: 'AI', eligible: true }
          ]
        },
        eligibilityCriteria: 'Minimum 7 CGPA',
        selectionProcess: {
          resumeShortlisting: true,
          prePlacementTalk: true,
          groupDiscussion: false,
          onlineTest: true,
          aptitudeTest: true,
          technicalTest: true,
          technicalInterview: true,
          hrInterview: true,
          otherRounds: 'Coding Challenge',
          expectedRecruits: 10,
          tentativeDate: '2024-06-15'
        },
        bondDetails: '2 years bond, penalty of 1 LPA',
        pointOfContact: [
          {
            name: 'John Doe',
            designation: 'HR Manager',
            mobile: '9876543210',
            email: 'john.doe@techsolutions.com'
          }
        ],
        additionalInfo: {
          sponsorEvents: 'Yes',
          internshipOffered: 'Yes',
          internshipDuration: '2 months',
          contests: 'Hackathon Sponsorship'
        },
        status: 'accepted',
        acceptedBy: 'user789',
        reviewComments: '',
        reviewDate: '2024-04-20',
        assignedUser:
          { name: 'Yash', email: 'yash@530.com',designation: 'ICC'},
        assignedDate: '10-10-2021,10:30:00 a.m.',
        assignedBy: 'admin123',
        driveStatus: 'new',
      },
      {
        id: 8,
        // companyDetails: {
          name: 'Innovatech Pvt Ltd',
          email: 'contact@innovatech.com',
          website: 'www.innovatech.com',
          companyType: 'Start-up',
          domain: 'Analytics',
          description: 'Analyze datasets and provide actionable insights.',
        // },
        jobProfiles: [
          {
            course: 'M.Tech',
            designation: 'Data Analyst',
            jobDescription: 'Analyze datasets and generate reports.',
            ctc: 1000000,
            takeHome: 850000,
            perks: 'Flexible hours, Stock Options',
            trainingPeriod: '3 months',
            placeOfPosting: 'Hyderabad'
          }
        ],
        eligibleBranches: {
          btech: [
            { name: 'Computer Engineering', eligible: true },
            { name: 'Mechanical Engineering', eligible: false }
          ],
          mtech: [
            { department: 'ECE', specialization: 'VLSI', eligible: true }
          ]
        },
        eligibilityCriteria: 'Minimum 6.5 CGPA',
        selectionProcess: {
          resumeShortlisting: true,
          prePlacementTalk: false,
          groupDiscussion: true,
          onlineTest: true,
          aptitudeTest: false,
          technicalTest: true,
          technicalInterview: true,
          hrInterview: false,
          otherRounds: 'Case Study',
          expectedRecruits: 5,
          tentativeDate: '2024-07-10'
        },
        bondDetails: 'No bond',
        pointOfContact: [
          {
            name: 'Jane Smith',
            designation: 'Recruitment Lead',
            mobile: '9876541230',
            email: 'jane.smith@innovatech.com'
          }
        ],
        additionalInfo: {
          sponsorEvents: 'No',
          internshipOffered: 'Yes',
          internshipDuration: '1 month',
          contests: 'Coding Bootcamp'
        },
        status: 'accepted',
        acceptedBy: 'user789',
        reviewComments: '',
        reviewDate: '2024-04-20',
        assignedUser:
          { name: 'Yash', email: 'yash@530.com',designation: 'ICC'},
        assignedDate: '10-10-2021,10:30:00 a.m.',
        assignedBy: 'admin123',

        driveStatus: 'ongoing',
      },
      {
        id: 9,
        // companyDetails: {
          name: 'Tech Solutions Inc.',
          email: 'hr@techsolutions.com',
          website: 'www.techsolutions.com',
          companyType: 'MNC',
          domain: 'IT',
          description: 'Develop and maintain software solutions.',
        // },
        jobProfiles: [
          {
            course: 'B.Tech',
            designation: 'Software Developer',
            jobDescription: 'Develop and maintain software solutions.',
            ctc: 1000000,
            takeHome: 800000,
            perks: 'Health Insurance, Stock Options',
            trainingPeriod: '6 months',
            placeOfPosting: 'Bangalore'
          }
        ],
        eligibleBranches: {
          btech: [
            { name: 'Computer Engineering', eligible: true },
            { name: 'Information Technology', eligible: true }
          ],
          mtech: [
            { department: 'CSE', specialization: 'AI', eligible: true }
          ]
        },
        eligibilityCriteria: 'Minimum 7 CGPA',
        selectionProcess: {
          resumeShortlisting: true,
          prePlacementTalk: true,
          groupDiscussion: false,
          onlineTest: true,
          aptitudeTest: true,
          technicalTest: true,
          technicalInterview: true,
          hrInterview: true,
          otherRounds: 'Coding Challenge',
          expectedRecruits: 10,
          tentativeDate: '2024-06-15'
        },
        bondDetails: '2 years bond, penalty of 1 LPA',
        pointOfContact: [
          {
            name: 'John Doe',
            designation: 'HR Manager',
            mobile: '9876543210',
            email: 'john.doe@techsolutions.com'
          }
        ],
        additionalInfo: {
          sponsorEvents: 'Yes',
          internshipOffered: 'Yes',
          internshipDuration: '2 months',
          contests: 'Hackathon Sponsorship'
        },
        status: 'pending',
        acceptedBy: '',
        reviewComments: '',
        reviewDate: '',
        assignedUser:
          { name: 'Yash', email: 'yash@530.com',designation: 'ICC'},
        assignedDate: '10-10-2021,10:30:00 a.m.',
        assignedBy: 'admin123',
        driveStatus: 'ongoing',
      },
      {
        id: 10,
        // companyDetails: {
          name: 'Innovatech Pvt Ltd',
          email: 'contact@innovatech.com',
          website: 'www.innovatech.com',
          companyType: 'Start-up',
          domain: 'Analytics',
          description: 'Analyze datasets and provide actionable insights.',
        // },
        jobProfiles: [
          {
            course: 'M.Tech',
            designation: 'Data Analyst',
            jobDescription: 'Analyze datasets and generate reports.',
            ctc: 1000000,
            takeHome: 850000,
            perks: 'Flexible hours, Stock Options',
            trainingPeriod: '3 months',
            placeOfPosting: 'Hyderabad'
          }
        ],
        eligibleBranches: {
          btech: [
            { name: 'Computer Engineering', eligible: true },
            { name: 'Mechanical Engineering', eligible: false }
          ],
          mtech: [
            { department: 'ECE', specialization: 'VLSI', eligible: true }
          ]
        },
        eligibilityCriteria: 'Minimum 6.5 CGPA',
        selectionProcess: {
          resumeShortlisting: true,
          prePlacementTalk: false,
          groupDiscussion: true,
          onlineTest: true,
          aptitudeTest: false,
          technicalTest: true,
          technicalInterview: true,
          hrInterview: false,
          otherRounds: 'Case Study',
          expectedRecruits: 5,
          tentativeDate: '2024-07-10'
        },
        bondDetails: 'No bond',
        pointOfContact: [
          {
            name: 'Jane Smith',
            designation: 'Recruitment Lead',
            mobile: '9876541230',
            email: 'jane.smith@innovatech.com'
          }
        ],
        additionalInfo: {
          sponsorEvents: 'No',
          internshipOffered: 'Yes',
          internshipDuration: '1 month',
          contests: 'Coding Bootcamp'
        },
        status: 'accepted',
        acceptedBy: 'user789',
        reviewComments: '',
        reviewDate: '2024-04-20',
        assignedUser:
          { name: 'Yash', email: 'yash@530.com',designation: 'ICC'},
        assignedDate: '10-10-2021,10:30:00 a.m.',
        assignedBy: 'admin123',
        driveStatus: 'completed',
      }
  ];


  // const queries = [
  //   studentQueries = [
  //       {id: 1,
  //           studentDetails: {
  //               name: "John Doe",
  //               email: "12214049@nitkkr.ac.in",
  //               rollNumber: 2014,
  //               department: "CSE",
  //               batch: 2022,},
  //           queryDetails: {
  //               querySubject: "What is React?",
  //               queryDescription: "Can you explain React?",
  //               querryReply: "React is a JavaScript library for building user interfaces.",
  //               reviewed: false 
  //               },
  //           },
  //       {id: 2,
  //           studentDetails: {
  //               name: "Mike Johnson",
  //               email: "",  
  //               rollNumber: 2015,
  //               department: "ECE",  
  //               batch: 2023,},  
  //           queryDetails: { 
  //               querySubject: "Can you explain Redux?",
  //               queryDescription: "Can you explain Redux?",
  //               queryReply: "Redux is a predictable state container for JavaScript apps.",
  //               reviewed: true },
  //           },
  //       {id: 3,
  //           studentDetails: {
  //               name: "John Doe",
  //               email: "",
  //               rollNumber: 2014,
  //               department: "CSE",
  //               batch: 2022,},
  //           queryDetails: {
  //               querySubject: "What is React?",
  //               queryDescription: "Can you explain React?",
  //               querryReply: "React is a JavaScript library for building user interfaces.",
  //               reviewed: false 
  //               },
  //           },
  //       ],

  //   recruiterQueries = [
  //       {id: 1,
  //           companyDetails: {
  //               name: "Tech Solutions Inc.",
  //               website: " www.techsolutions.com",
  //               email: "", 
  //               domain: "IT",
  //               },
  //           queryDetails: {
  //               querySubject: "How to schedule an interview?",
  //               queryDescription: "Can you explain the process of scheduling an interview?",
  //               queryReply: "You can schedule an interview by sending an email to",
  //               reviewed: false
  //           },
  //       },
  //       {id: 2,
  //           companyDetails: {
  //               name: "Tech Solutions Inc.",
  //               website: " www.techsolutions.com",
  //               email: "", 
  //               domain: "IT",
  //               },
  //           queryDetails: {
  //               querySubject: "How to schedule an interview?",
  //               queryDescription: "Can you explain the process of scheduling an interview?",
  //               queryReply: "You can schedule an interview by sending an email to",
  //               reviewed: false 
  //           },
  //       },
  //       {id: 3,
  //           companyDetails: {
  //               name: "Tech Solutions Inc.",
  //               website: " www.techsolutions.com",
  //               email: "", 
  //               domain: "IT",
  //               },
  //           queryDetails: {
  //               querySubject: "How to schedule an interview?",
  //               queryDescription: "Can you explain the process of scheduling an interview?",
  //               queryReply: "You can schedule an interview by sending an email to",
  //               reviewed: false 
  //           },
  //       },
  //   ],
  // ];

  // export {jnfDetails, queries};

  export default jnfDetails;
