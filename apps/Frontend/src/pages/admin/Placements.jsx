import { useState } from 'react';
import { Container, Button, Box, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddPlacementDialog from '../../components/admin/placements/AddPlacementDialog';
import PlacementTable from '../../components/admin/placements/PlacementTable';
import PlacementAnalytics from '../../components/admin/placements/PlacementAnalytics';
import {useJNFData} from '../../hooks/admin/useJNFData';
import { useEffect } from 'react';
import { useTheme } from '@mui/material';
import placementService from '../../services/admin/placementService';


const Placements = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { getAcceptedJNFs, getJNFById } = useJNFData();
  const [open, setOpen] = useState(false);

  const theme = useTheme();

  const [newPlacement, setNewPlacement] = useState({
    title: '',
    companyName: '',
    companyEmail: '',
    companyWebsite: '',
    companyType: '',
    companyDomain: '',
    companyDescription: '',
    jobId: '',
    course: '',
    jobDesignation: '',
    jobDescription:'',
    jobDescriptionFile: '',
    ctc: '',
    takeHome: '',
    perks: '',
    stipend: null,
    trainingPeriod: '',
    internDuration: null,
    btech:[],
    mtech:[],
    msc:[],
    phd:[],
    mca:[],
    eligibility: '',
    branches: [],
    cgpa: '',
    backlogs: '',
    location: [],
    selectionRounds: [],
    selectionDetails: {},
    expectedRecruits: '',
    bond: '',
    pointOfContact: [],
    assignedUser: '',
    applicationDeadline: '',
    applicationLink: '',
  });

  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPlacements = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await placementService.getAllPlacements();
        setPlacements(data);
      } catch (err) {
        setError(err.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    };
  
    fetchPlacements();
  }, []);
  
  console.log(placements); 

  const handleChange = (e, value, fieldName) => {
    if (fieldName === 'branches') {
      setNewPlacement(prev => ({ ...prev, branches: value }));
    } else if (fieldName === 'location') {
      setNewPlacement(prev => ({ ...prev, location: value }));
    } else if (e?.target) {
      const { name, value: targetValue } = e.target;
      setNewPlacement(prev => ({ ...prev, [name]: targetValue }));
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddPlacement = async () => {
    try {
      const placementDriveData = {
        placementDrive_title: `${newPlacement.companyName} Placement Drive`,
  
        companyDetails: {
          name: newPlacement.companyName,
          email: newPlacement.companyEmail || "", // Ensure email is provided
          website: newPlacement.companyWebsite || "",
          companyType: newPlacement.companyType || "",
          domain: newPlacement.domain || "",
          description: newPlacement.aboutCompany || "",
        },
  
        jobProfile: {
          profileId: newPlacement.profileId || "",
          course: newPlacement.course || "",
          designation: newPlacement.role,
          jobDescription: {
            description: newPlacement.aboutRole || "",
            attachFile: !!newPlacement.jobDescriptionFile, // Convert to boolean
            file: newPlacement.jobDescriptionFile || "", // File URL (if applicable)
          },
          ctc: parseFloat(newPlacement.ctcTotal) || 0,
          takeHome: parseFloat(newPlacement.inHand) || 0,
          perks: newPlacement.perksAndBenefits || "",
          trainingPeriod: newPlacement.trainingPeriod || "",
          placeOfPosting: Array.isArray(newPlacement.location) ? newPlacement.location.join(", ") : newPlacement.location,
          jobType: newPlacement.jobType || "",
          stipend: parseFloat(newPlacement.stipend) || 0,
          internDuration: newPlacement.internDuration || "",
        },
  
        eligibleBranchesForProfiles: {
          profileId: newPlacement.profileId || "",
          branches: {
            btech: newPlacement.branches.map((branch) => ({
              name: branch,
              eligible: true,
            })),
          },
        },
  
        // selectionProcessForProfile: {
        //   profileId: newPlacement.profileId || "",
        //   rounds: newPlacement.selectionRounds.map((round, index) => ({
        //     roundNumber: index + 1,
        //     roundName: round,
        //     details: newPlacement.selectionDetails?.[round] || "",
        //   })),
        //   expectedRecruits: newPlacement.expectedRecruits || 0,
        //   tentativeDate: newPlacement.expectedJoiningDate || "",
        // },
  
        eligibilityCriteria: {
          minCgpa: parseFloat(newPlacement.cgpa) || 0,
          backlogAllowed: parseInt(newPlacement.backlogs) || 0,
        },
  
        bondDetails: {
          hasBond: Boolean(newPlacement.bond),
          details: newPlacement.bond || "",
        },
  
        pointOfContact: newPlacement.pointOfContact || [],
  
        assignedUser: newPlacement.assignedUser || "",
  
        applicationDetails: {
          applicationDeadline: newPlacement.applicationDeadline || "",
          applicationLink: newPlacement.applicationLink || "",
        },
      };
  
      // Call API to create placement drive
      const response = await placementService.createPlacementDrive(placementDriveData);
        
      setSelectedJNF('');
      setOpenDialog(false);
  
      console.log("✅ Placement Drive Created Successfully:", response);
    } catch (error) {
      console.error("❌ Failed to create placement drive:", error);
    }
  };

  // Add this branches data
  const branchOptions = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    // Add more branches as needed
  ];

  const selectionRounds = [
    'Aptitude Test',
    'Group Discussion',
    'Technical Interview',
    'HR Interview',
    'Coding Round',
    'Machine Test',
    'Case Study',
    'Presentation',
    'Essay Writing',
  ];

  const courses = [
    'B.Tech',
    'M.Tech',
    'MBA',
    'MCA',
    'Ph.D',    
  ]
  // Add this locations data (you can replace with API call)
  const locationOptions = [
    'Bangalore',
    'Mumbai',
    'Delhi',
    'Hyderabad',
    'Chennai',
    'Pune',
    'Kolkata',
    'Noida',
    'Gurgaon',
    'Ahmedabad',
    // Add more locations as needed
  ];

  const [acceptedJNFs, setAcceptedJNFs] = useState([]);

  // Add state for JNF selection
  const [selectedJNF, setSelectedJNF] = useState('');

  useEffect(() => {
    const fetchAcceptedJNFs = async () => {
      const jnfs = await getAcceptedJNFs();
      setAcceptedJNFs(jnfs);
    };
    fetchAcceptedJNFs();
  }, []);

  const handleJNFSelect = async (event) => {
    const jnfId = event.target.value;
    setSelectedJNF(jnfId);

    if (jnfId) {
      const jnfData = await getJNFById(jnfId);
      if (jnfData) {
        setNewPlacement(prev => ({
          ...prev,
          companyName: jnfData.name || '',
          aboutCompany: jnfData.description || '',
          role: jnfData.jobProfiles[0]?.designation || '',
          aboutRole: jnfData.jobProfiles[0]?.jobDescription || '',
          location: Array.isArray(jnfData.jobProfiles[0]?.placeOfPosting)
            ? jnfData.jobProfiles[0].placeOfPosting
            : jnfData.jobProfiles[0]?.placeOfPosting
              ? jnfData.jobProfiles[0].placeOfPosting.split(',').map(loc => loc.trim())
              : [],
          ctcTotal: jnfData.jobProfiles[0]?.ctc || '',
          inHand: jnfData.jobProfiles[0]?.takeHome || '',
          perksAndBenefits: jnfData.jobProfiles[0]?.perks || '',
          stipend: jnfData.additionalInfo?.internshipOffered || '',
          bond: jnfData.bondDetails || '',
          expectedJoiningDate: jnfData.selectionProcess?.tentativeDate || '',
          eligibility: jnfData.eligibilityCriteria || '',
          branches: Object.entries(jnfData.eligibleBranches || {})
            .filter(([_, value]) => value.eligible)
            .map(([branch]) => branch) || [],
          cgpa: jnfData.eligibilityCriteria?.match(/\d+(\.\d+)?/)?.[0] || '',
        }));
      }
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  
  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    type: 'All',
  });

  // const handleFilterChange = (key, value) => {
  //   setFilters((prevFilters) => ({
  //     ...prevFilters,
  //     [key]: value,
  //   }));
  // };

  const handleSearchChange = (value) => {
    handleFilterChange('search', value);
  };


  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4"
        sx={{color:theme.palette.text.primary}}>Placements</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}        >
          Add Placement Drive
        </Button>
      </Box>
      <AddPlacementDialog open={open} handleClose={handleClose} />

      <PlacementAnalytics 
        placements={placements}
      />
      <PlacementTable/>
    </Container>
  );
};

export default Placements;