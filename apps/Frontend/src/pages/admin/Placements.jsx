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


const Placements = () => {
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
        sx={{color:theme.palette.text.primary}}>Placements</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick= {() => setOpenDialog(true)}
        >
          Add Placement Drive
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

export default Placements;



// import { useState, useEffect } from 'react';
// import { Box, Typography, Grid, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Autocomplete, Checkbox, FormControl, FormControlLabel, FormGroup, InputAdornment, MenuItem, Select, TextareaAutosize, InputLabel, Chip, Tooltip } from '@mui/material';
// import { Add as AddIcon } from '@mui/icons-material';
// import DataTable from '../../components/common/DataTable';
// import PlacementAnalytics from '../../components/admin/placements/PlacementAnalytics';
// import PlacementFilters from '../../components/admin/placements/PlacementFilters';
// import { useTable } from '../../hooks/admin/useTable';
// import { usePlacement } from '../../hooks/admin/usePlacement';
// import { useTheme } from '@mui/material';
// import { useJNFData } from '../../hooks/admin/useJNFData';

// const Placements = () => {
//   const theme = useTheme();
//   const { getPlacements } = usePlacement();
//   const { getAcceptedJNFs, getJNFById } = useJNFData();
//   const [filters, setFilters] = useState({
//     search: '',
//     // company: 'All',
//     status: 'All',
//     year: new Date().getFullYear().toString(),
//   });

//   const columns = [
//     { field: 'id', headerName: 'ID', width: 90 },
//     { field: 'companyName', headerName: 'Company', width: 200 },
//     { field: 'role', headerName: 'Role', width: 150 },
//     // { field: 'package', headerName: 'Package (LPA)', width: 150 },
//     // { field: 'appliedCount', headerName: 'Applied', width: 100 },
//     // { field: 'selectedCount', headerName: 'Selected', width: 100 },
//     { field: 'status', headerName: 'Status', width: 120 },
//     { field: 'startDate', headerName: 'Start Date', width: 120 },
//     // { 
//     //   field: 'location', 
//     //   headerName: 'Locations', 
//     //   width: 200,
//     //   renderCell: (params) => (
//     //     <Tooltip title={params.value}>
//     //       <span>{params.value}</span>
//     //     </Tooltip>
//     //   )
//     // },
//   ];

//   // Mock data for development
//   const mockData = [
//     {
//       id: 1,
//       companyName: 'Tech Corp',
//       role: 'Software Engineer',
//       package: '12.5',
//       appliedCount: 50,
//       selectedCount: 5,
//       status: 'In Progress',
//       startDate: '2024-02-15',
//     },
//     {
//       id: 2,
//       companyName: 'Data Systems',
//       role: 'Data Analyst',
//       package: '8.5',
//       appliedCount: 30,
//       selectedCount: 3,
//       status: 'Completed',
//       startDate: '2024-02-10',
//     },
//   ];

//   const mockPagination = {
//     page: 0,
//     rowsPerPage: 10,
//     total: mockData.length,
//   };

//   const handleFilterChange = (field, value) => {
//     setFilters(prev => ({ ...prev, [field]: value }));
//   };

  // const [open, setOpen] = useState(false);
  // const [newPlacement, setNewPlacement] = useState({
  //   companyName: '',
  //   role: '',
  //   location: [],
  //   ctcTotal: '',
  //   inHand: '',
  //   perksAndBenefits: '',
  //   stipend: '',
  //   bond: '',
  //   expectedJoiningDate: '',
  //   aboutRole: '',
  //   aboutCompany: '',
  //   eligibility: '',
  //   branches: [],
  //   cgpa: '',
  //   backlogs: '0',
  // });

  // const [placements, setPlacements] = useState(mockData);

  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  // const handleChange = (e, value, fieldName) => {
  //   if (fieldName === 'branches') {
  //     setNewPlacement(prev => ({ ...prev, branches: value }));
  //   } else if (fieldName === 'location') {
  //     setNewPlacement(prev => ({ ...prev, location: value }));
  //   } else if (e?.target) {
  //     const { name, value: targetValue } = e.target;
  //     setNewPlacement(prev => ({ ...prev, [name]: targetValue }));
  //   }
  // };

  // const handleAddPlacement = () => {
  //   const newId = placements.length ? Math.max(...placements.map(p => p.id)) + 1 : 1;
    
  //   const newPlacementWithId = {
  //     id: newId,
  //     companyName: newPlacement.companyName,
  //     role: newPlacement.role,
  //     package: newPlacement.ctcTotal/100000,
  //     appliedCount: 0,
  //     selectedCount: 0,
  //     status: 'In Progress',
  //     startDate: newPlacement.expectedJoiningDate,
  //     location: newPlacement.location.join(', '),
  //   };

  //   setPlacements(prev => [...prev, newPlacementWithId]);
    
  //   // Reset the form
  //   setNewPlacement({
  //     companyName: '',
  //     role: '',
  //     location: [],
  //     ctcTotal: '',
  //     inHand: '',
  //     perksAndBenefits: '',
  //     stipend: '',
  //     bond: '',
  //     expectedJoiningDate: '',
  //     aboutRole: '',
  //     aboutCompany: '',
  //     eligibility: '',
  //     branches: [],
  //     cgpa: '',
  //     backlogs: '0',
  //   });
    
  //   setSelectedJNF('');
  //   handleClose();
  // };

  // const handleViewPlacement = () => {
  //   // Redirect to placement details page
  // };

  // // Add this branches data
  // const branchOptions = [
  //   'Computer Science',
  //   'Information Technology',
  //   'Electronics & Communication',
  //   'Electrical Engineering',
  //   'Mechanical Engineering',
  //   'Civil Engineering',
  //   // Add more branches as needed
  // ];

  // // Add this locations data (you can replace with API call)
  // const locationOptions = [
  //   'Bangalore',
  //   'Mumbai',
  //   'Delhi',
  //   'Hyderabad',
  //   'Chennai',
  //   'Pune',
  //   'Kolkata',
  //   'Noida',
  //   'Gurgaon',
  //   'Ahmedabad',
  //   // Add more locations as needed
  // ];

  // const [acceptedJNFs, setAcceptedJNFs] = useState([]);

  // // Add state for JNF selection
  // const [selectedJNF, setSelectedJNF] = useState('');

  // useEffect(() => {
  //   const fetchAcceptedJNFs = async () => {
  //     const jnfs = await getAcceptedJNFs();
  //     setAcceptedJNFs(jnfs);
  //   };
  //   fetchAcceptedJNFs();
  // }, []);

  // const handleJNFSelect = async (event) => {
  //   const jnfId = event.target.value;
  //   setSelectedJNF(jnfId);

  //   if (jnfId) {
  //     const jnfData = await getJNFById(jnfId);
  //     if (jnfData) {
  //       setNewPlacement(prev => ({
  //         ...prev,
  //         companyName: jnfData.name || '',
  //         aboutCompany: jnfData.description || '',
  //         role: jnfData.jobProfiles[0]?.designation || '',
  //         aboutRole: jnfData.jobProfiles[0]?.jobDescription || '',
  //         location: Array.isArray(jnfData.jobProfiles[0]?.placeOfPosting)
  //           ? jnfData.jobProfiles[0].placeOfPosting
  //           : jnfData.jobProfiles[0]?.placeOfPosting
  //             ? jnfData.jobProfiles[0].placeOfPosting.split(',').map(loc => loc.trim())
  //             : [],
  //         ctcTotal: jnfData.jobProfiles[0]?.ctc || '',
  //         inHand: jnfData.jobProfiles[0]?.takeHome || '',
  //         perksAndBenefits: jnfData.jobProfiles[0]?.perks || '',
  //         stipend: jnfData.additionalInfo?.internshipOffered || '',
  //         bond: jnfData.bondDetails || '',
  //         expectedJoiningDate: jnfData.selectionProcess?.tentativeDate || '',
  //         eligibility: jnfData.eligibilityCriteria || '',
  //         branches: Object.entries(jnfData.eligibleBranches || {})
  //           .filter(([_, value]) => value.eligible)
  //           .map(([branch]) => branch) || [],
  //         cgpa: jnfData.eligibilityCriteria?.match(/\d+(\.\d+)?/)?.[0] || '',
  //       }));
  //     }
  //   }
  // };

//   return (
//     <Box>
      // <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
      //   <Typography variant="h4"
      //   sx={{color:theme.palette.text.primary}}>Placements</Typography>
      //   <Button
      //     variant="contained"
      //     startIcon={<AddIcon />}
      //     onClick={handleOpen}
      //   >
      //     Add Placement Drive
      //   </Button>
      // </Box>

//       <PlacementAnalytics />
      
//       <PlacementFilters 
//         filters={filters}
//         onFilterChange={handleFilterChange}
//       />

//       <DataTable
//         columns={[
//           ...columns,
//           {
//             field: 'actions',
//             headerName: 'Actions',
//             width: 150,
//             renderCell: (params) => (
//               <Button
//                 variant="contained"
//                 onClick={() => handleViewPlacement()}
//               >
//                 View
//               </Button>
//             ),
//           },
//         ]}
//         data={placements}
//         pagination={{ ...mockPagination, total: placements.length }}
//       />

      // <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      //   <DialogTitle>Add Placement Drive</DialogTitle>
      //   <DialogContent>
      //     <FormControl fullWidth margin="dense">
      //       <InputLabel>Select JNF</InputLabel>
      //       <Select
      //         value={selectedJNF}
      //         onChange={handleJNFSelect}
      //         label="Select JNF"
      //       >
      //         <MenuItem value="">
      //           <em>None</em>
      //         </MenuItem>
      //         {acceptedJNFs.map((jnf) => (
      //           <MenuItem key={jnf.id} value={jnf.id}>
      //             {jnf.name} - {jnf.jobProfiles[0]?.designation}
      //           </MenuItem>
      //         ))}
      //       </Select>
      //     </FormControl>
      //     <TextField
      //       autoFocus
      //       margin="dense"
      //       name="companyName"
      //       label="Company Name"
      //       type="text"
      //       fullWidth
      //       required
      //       value={newPlacement.companyName}
      //       onChange={handleChange}
      //     />
      //     <TextField
      //       margin="dense"
      //       name="role"
      //       label="Role"
      //       type="text"
      //       fullWidth
      //       required
      //       value={newPlacement.role}
      //       onChange={handleChange}
      //     />
      //     <Autocomplete
      //       multiple
      //       options={locationOptions}
      //       value={newPlacement.location}
      //       onChange={(event, newValue) => {
      //         handleChange(null, newValue, 'location');
      //       }}
      //       renderInput={(params) => (
      //         <TextField
      //           {...params}
      //           margin="dense"
      //           label="Locations"
      //           required
      //           helperText="Select one or more locations"
      //         />
      //       )}
      //       renderTags={(value, getTagProps) =>
      //         value.map((option, index) => (
      //           <Chip
      //             label={option}
      //             {...getTagProps({ index })}
      //             key={option}
      //           />
      //         ))
      //       }
      //     />
      //     <TextField
      //       margin="dense"
      //       name="ctcTotal"
      //       label="CTC Total"
      //       type="number"
      //       fullWidth
      //       required
      //       InputProps={{
      //         startAdornment: <InputAdornment position="start">₹</InputAdornment>,
      //         endAdornment: <InputAdornment position="end">LPA</InputAdornment>,
      //       }}
      //       value={newPlacement.ctcTotal}
      //       onChange={handleChange}
      //     />
      //     <TextField
      //       margin="dense"
      //       name="inHand"
      //       label="In Hand"
      //       type="number"
      //       fullWidth
      //       required
      //       InputProps={{
      //         startAdornment: <InputAdornment position="start">₹</InputAdornment>,
      //         endAdornment: <InputAdornment position="end">LPA</InputAdornment>,
      //       }}
      //       value={newPlacement.inHand}
      //       onChange={handleChange}
      //     />
      //     <TextField
      //       margin="dense"
      //       name="perksAndBenefits"
      //       label="Perks, Benefits & Bonus"
      //       multiline
      //       rows={3}
      //       fullWidth
      //       value={newPlacement.perksAndBenefits}
      //       onChange={handleChange}
      //     />
      //     <TextField
      //       margin="dense"
      //       name="stipend"
      //       label="Internship Stipend (if applicable)"
      //       type="number"
      //       fullWidth
      //       InputProps={{
      //         startAdornment: <InputAdornment position="start">₹</InputAdornment>,
      //         endAdornment: <InputAdornment position="end">/month</InputAdornment>,
      //       }}
      //       value={newPlacement.stipend}
      //       onChange={handleChange}
      //     />
      //     <TextField
      //       margin="dense"
      //       name="bond"
      //       label="Bond Details"
      //       multiline
      //       rows={2}
      //       fullWidth
      //       value={newPlacement.bond}
      //       onChange={handleChange}
      //     />
      //     <TextField
      //       margin="dense"
      //       name="expectedJoiningDate"
      //       label="Expected Date of Joining"
      //       type="date"
      //       fullWidth
      //       required
      //       InputLabelProps={{ shrink: true }}
      //       value={newPlacement.expectedJoiningDate}
      //       onChange={handleChange}
      //     />
      //     <TextField
      //       margin="dense"
      //       name="aboutRole"
      //       label="About the Role"
      //       multiline
      //       rows={4}
      //       fullWidth
      //       required
      //       value={newPlacement.aboutRole}
      //       onChange={handleChange}
      //     />
      //     <TextField
      //       margin="dense"
      //       name="aboutCompany"
      //       label="About the Company"
      //       multiline
      //       rows={4}
      //       fullWidth
      //       required
      //       value={newPlacement.aboutCompany}
      //       onChange={handleChange}
      //     />
      //     <TextField
      //       margin="dense"
      //       name="eligibility"
      //       label="Eligibility Criteria"
      //       multiline
      //       rows={3}
      //       fullWidth
      //       required
      //       value={newPlacement.eligibility}
      //       onChange={handleChange}
      //     />
      //     <Autocomplete
      //       multiple
      //       options={branchOptions}
      //       value={newPlacement.branches}
      //       onChange={(e, value) => handleChange(null, value, 'branches')}
      //       renderInput={(params) => (
      //         <TextField
      //           {...params}
      //           margin="dense"
      //           label="Eligible Branches"
      //           required
      //         />
      //       )}
      //     />
      //     <TextField
      //       margin="dense"
      //       name="cgpa"
      //       label="Minimum CGPA Required"
      //       type="number"
      //       fullWidth
      //       required
      //       InputProps={{
      //         inputProps: { min: 0, max: 10, step: 0.1 }
      //       }}
      //       value={newPlacement.cgpa}
      //       onChange={handleChange}
      //     />
      //     <TextField
      //       margin="dense"
      //       name="backlogs"
      //       label="Maximum Backlogs Allowed"
      //       type="number"
      //       fullWidth
      //       required
      //       InputProps={{
      //         inputProps: { min: 0 }
      //       }}
      //       value={newPlacement.backlogs}
      //       onChange={handleChange}
      //     />
      //   </DialogContent>
      //   <DialogActions>
      //     <Button onClick={handleClose}>Cancel</Button>
      //     <Button onClick={handleAddPlacement}>Add</Button>
      //   </DialogActions>
      // </Dialog>
//     </Box>
//   );
// };

// export default Placements;