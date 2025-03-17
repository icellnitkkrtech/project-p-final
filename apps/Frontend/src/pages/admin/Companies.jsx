import { useState, useEffect } from 'react';
import { 
  Grid, Box, Tabs, Tab, Paper, Button, ToggleButton, ToggleButtonGroup, 
  Alert, CircularProgress
} from '@mui/material';
import { Add, ViewList, ViewModule } from '@mui/icons-material';
import CompanyList from '../../components/admin/company/CompanyList';
import CompanyDetails from '../../components/admin/company/CompanyDetails';
import CompanyRegistration from '../../components/admin/company/CompanyRegistration';
import { useSearchParams, useNavigate } from 'react-router-dom';
import companyService from '../../services/admin/companyService';

const Companies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = parseInt(searchParams.get('tab') || '0');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await companyService.getCompanies();
        if (response.data?.data?.data) {
          setCompanies(response.data.data.data);
        }
      } catch (err) {
        setError('Failed to fetch companies');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Filter companies based on current tab
  const getFilteredCompanies = () => {
    if (!companies) return [];

    switch (currentTab) {
      case 0: // Ongoing Recruitment
        return companies.filter(company => 
          company.recruitmentStatus === 'ongoing'
        );
      
      case 1: // Upcoming Companies
        return companies.filter(company => 
          company.recruitmentStatus === 'upcoming'
        );
      
      case 2: // Past Recruitments
        return companies.filter(company => 
          company.recruitmentStatus === 'completed'
        );
      
      case 3: // All Companies
        return companies;
      
      default:
        return [];
    }
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleCompanyRegistrationClose = () => {
    setIsRegistrationOpen(false);
  };

  const getTabColor = (index) => {
    return currentTab === index ? 'primary.main' : 'text.secondary';
  };

  // Get counts for each tab
  const getTabCounts = () => {
    if (!companies) return { ongoing: 0, upcoming: 0, completed: 0, all: 0 };

    return {
      ongoing: companies.filter(c => 
        c.recruitmentStatus === 'ongoing'
      ).length,
      upcoming: companies.filter(c => 
        c.recruitmentStatus === 'upcoming'
      ).length,
      completed: companies.filter(c => 
        c.recruitmentStatus === 'completed'
      ).length,
      all: companies.length
    };
  };

  const tabCounts = getTabCounts();

  const handleCompanyView = (company) => {
    setSelectedCompany(company);
    setIsEditMode(false);
  };

  const handleCompanyEdit = (company) => {
    console.log("Edit clicked for company:", company);
    setSelectedCompany(company);
    setIsEditMode(true);
  };

  const handleCompanyUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await companyService.getCompanies();
      if (response.data?.data?.data) {
        setCompanies(response.data.data.data);
      }
      setSelectedCompany(null);
      setIsEditMode(false);
    } catch (err) {
      setError('Failed to refresh companies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Paper sx={{ flexGrow: 1, mr: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tabs 
            value={currentTab} 
            onChange={(e, val) => setSearchParams({ tab: val.toString() })}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab 
              label={`Ongoing Recruitment (${tabCounts.ongoing})`}
              sx={{ color: getTabColor(0) }}
            />
            <Tab 
              label={`Upcoming Companies (${tabCounts.upcoming})`}
              sx={{ color: getTabColor(1) }}
            />
            <Tab 
              label={`Past Recruitments (${tabCounts.completed})`}
              sx={{ color: getTabColor(2) }}
            />
            <Tab 
              label={`All Companies (${tabCounts.all})`}
              sx={{ color: getTabColor(3) }}
            />
          </Tabs>
          <Box px={2}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
            >
              <ToggleButton value="grid" aria-label="grid view">
                <ViewModule />
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view">
                <ViewList />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Paper>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsRegistrationOpen(true)}
        >
          Add Company
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <CompanyList 
          companies={getFilteredCompanies()}
          onCompanySelect={handleCompanyView}
          onCompanyEdit={handleCompanyEdit}
          selectedCompany={selectedCompany}
          viewMode={viewMode}
          onCompanyUpdate={handleCompanyUpdate}
        />
      )}

      {selectedCompany && (
        <CompanyDetails
          company={selectedCompany}
          open={Boolean(selectedCompany)}
          onClose={() => {
            setSelectedCompany(null);
            setIsEditMode(false);
          }}
          isEditMode={isEditMode}
          onUpdate={handleCompanyUpdate}
        />
      )}

      <CompanyRegistration
        open={isRegistrationOpen}
        onClose={handleCompanyRegistrationClose}
      />
    </Box>
  );
};

export default Companies; 