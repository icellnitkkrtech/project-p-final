import { useState } from 'react';
import { Container, Button, Box, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddPlacementDialog from '../../components/admin/placements/AddPlacementDialog';
import PlacementTable from '../../components/admin/placements/PlacementTable';
import PlacementFilters from '../../components/admin/placements/PlacementFilters';
import PlacementAnalytics from '../../components/admin/placements/PlacementAnalytics';
import {useJNFData} from '../../hooks/admin/useJNFData';
import { useEffect } from 'react';
import { useTheme } from '@mui/material';


const Internships = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { getAcceptedJNFs, getJNFById } = useJNFData();
  
  const theme = useTheme();

//  Mock data for development
  const mockData = [
    {
      id: 1,
      companyName: 'Tech Corp',
      role: 'Software Engineer',
      package: '12.5',
      appliedCount: 50,
      selectedCount: 5,
      status: 'In Progress',
      startDate: '2024-02-15',
    },
    {
      id: 2,
      companyName: 'Data Systems',
      role: 'Data Analyst',
      package: '8.5',
      appliedCount: 30,
      selectedCount: 3,
      status: 'Completed',
      startDate: '2024-02-10',
    },
  ];

  const mockPagination = {
      page: 0,
      rowsPerPage: 10,
      total: mockData.length,
  };

  const [newPlacement, setNewPlacement] = useState({
    companyName: '',
    role: '',
    location: [],
    ctcTotal: '',
    inHand: '',
    perksAndBenefits: '',
    stipend: '',
    bond: '',
    expectedJoiningDate: '',
    aboutRole: '',
    aboutCompany: '',
    eligibility: '',
    branches: [],
    cgpa: '',
    backlogs: '',
  });

  const [placements, setPlacements] = useState(mockData);

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

  const handleAddPlacement = () => {
    const newId = placements.length ? Math.max(...placements.map(p => p.id)) + 1 : 1;
    
    const newPlacementWithId = {
      id: newId,
      companyName: newPlacement.companyName,
      role: newPlacement.role,
      package: newPlacement.ctcTotal/100000,
      appliedCount: 0,
      selectedCount: 0,
      status: 'In Progress',
      startDate: newPlacement.expectedJoiningDate,
      location: newPlacement.location.join(', '),
    };

    setPlacements(prev => [...prev, newPlacementWithId]);
    
    // Reset the form
    setNewPlacement({
      companyName: '',
      role: '',
      location: [],
      ctcTotal: '',
      inHand: '',
      perksAndBenefits: '',
      stipend: '',
      bond: '',
      expectedJoiningDate: '',
      aboutRole: '',
      aboutCompany: '',
      eligibility: '',
      branches: [],
      cgpa: '',
      backlogs: '',
    });
    
    setSelectedJNF('');
    setOpenDialog(false);
  };

  const handleViewPlacement = () => {
    // Redirect to placement details page
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

  const filteredPlacements = placements.filter((placement) => {
    return (
      ((filters.search || '') === '' || 
        [placement.companyName, placement.role, placement.startDate, placement.location, placement.ctcTotal]
          .some(field => field?.toLowerCase().includes((filters.search || '').toLowerCase()))
      ) &&
      (filters.status === 'All' || placement.status === filters.status) &&
      (filters.year === '' || placement.year === filters.year)
    );
  });
  

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4"
        sx={{color:theme.palette.text.primary}}>Internships</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick= {() => setOpenDialog(true)}
        >
          Add Internship Drive
        </Button>
      </Box>
      <AddPlacementDialog 
        open={openDialog} 
        handleClose={() => setOpenDialog(false)}
        setPlacements={setPlacements}
        acceptedJNFs={acceptedJNFs}
        locationOptions={locationOptions} 
        branchOptions={branchOptions} 
        handleJNFSelect={handleJNFSelect}
        newPlacement={newPlacement}
        handleChange={handleChange}
        handleAddPlacement={handleAddPlacement}
        selectionRounds={selectionRounds}
        courses={courses}
      />
      <PlacementAnalytics 
        placements={filteredPlacements}
      />
      <PlacementFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
      />
      <PlacementTable
        placements={filteredPlacements}
        mockPagination={mockPagination}
       />
    </Container>
  );
};

export default Internships;