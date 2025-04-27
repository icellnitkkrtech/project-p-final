import React, { useState, useEffect } from "react";
import { Tabs, Tab, Toolbar, Box, Typography, CircularProgress } from "@mui/material";
import { recruiterQueries } from "../../components/admin/query/QueryData";
import { queryService } from "../../services/queryService";
import QueryTable from "../../components/admin/query/QueryTable";
import QueryDialog from "../../components/admin/query/QueryDialog";
import SearchBar from "../../components/admin/query/SearchBar";
import { useSnackbar } from 'notistack';

const Query = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState("student");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  const [studentData, setStudentData] = useState([]);
  const [recruiterData] = useState(recruiterQueries);

  // Fetch student queries from backend
  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setLoading(true);
        const response = await queryService.getAdminQueries();
        if (response.success) {
          setStudentData(response.data);
        }
      } catch (error) {
        console.error('Error fetching queries:', error);
        enqueueSnackbar('Failed to fetch queries', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, [enqueueSnackbar]);

  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  const handleViewDetails = (query) => {
    setSelectedQuery(query);
    setReplyText(query.reply || "");
    setOpenDialog(true);
  };

  const handleSendReply = async () => {
    if (!selectedQuery?.id || !replyText.trim()) {
      enqueueSnackbar('Please enter a reply message', { variant: 'error' });
      return;
    }

    try {
      setLoading(true);
      const response = await queryService.respondToQuery(selectedQuery.id, {
        message: replyText
      });

      if (response.success) {
        // Update local state
        setStudentData(prevData => 
          prevData.map(q => 
            q.id === selectedQuery.id 
              ? {
                  ...q,
                  status: 'resolved',
                  reviewed: true,
                  responses: [...(q.responses || []), {
                    message: replyText,
                    createdAt: new Date()
                  }]
                }
              : q
          )
        );
        
        enqueueSnackbar('Reply sent successfully', { variant: 'success' });
        setOpenDialog(false);
        setReplyText('');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      enqueueSnackbar(error.message || 'Failed to send reply', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this query?");
  
    if (confirmDelete) {
      try {
        setLoading(true);
        const response = await queryService.deleteQuery(id);
        
        if (response.success) {
          setStudentData(prevData => prevData.filter(q => q._id !== id));
          enqueueSnackbar('Query deleted successfully', { variant: 'success' });
        }
      } catch (error) {
        console.error('Error deleting query:', error);
        enqueueSnackbar('Failed to delete query', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredQueries = (activeTab === "student" ? studentData : recruiterData).filter(
    (query) =>
      query.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activeTab === "student" ? query.name : query.company)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ justifyContent: "space-between", p: 2 }}>
        <Typography variant="h4" color="primary">Query Management</Typography>
        <Toolbar sx={{ justifyContent: "space-between", p: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Students" value="student" />
            <Tab label="Recruiters" value="recruiter" />
          </Tabs>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </Toolbar>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <QueryTable
          queries={filteredQueries} 
          onViewDetails={handleViewDetails} 
          activeTab={activeTab}
          onDelete={handleDelete}
        />
      )}

      <QueryDialog
        open={openDialog}
        query={selectedQuery}
        replyText={replyText}
        setReplyText={setReplyText}
        onClose={() => setOpenDialog(false)}
        onSendReply={handleSendReply}
        activeTab={activeTab}
        loading={loading}
      />
    </Box>
  );
};

export default Query;
