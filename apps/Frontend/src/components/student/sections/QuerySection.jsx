import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  QuestionAnswer,
  Add,
  Search,
  FilterList,
  Label,
  Delete,
  Edit,
  Circle,
  Flag,
  AccessTime,
} from "@mui/icons-material";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Tooltip,
  Typography,
  Box,
  Chip,
  IconButton,
  DialogContentText,
  CircularProgress,
} from "@mui/material";
import { useSnackbar } from 'notistack';
import { queryService } from '../../../services/queryService';
import { setupWebSocket } from '../../../utils/websocket';
import  {useAuthContext } from '../../../contexts/AuthContext';

const QuerySection = () => {
  const { user, isAuthenticated } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  
  const [loading, setLoading] = useState(false);
  const [queries, setQueries] = useState([]);
  const [openNew, setOpenNew] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [newQuery, setNewQuery] = useState({
    subject: '',
    description: '',
    category: 'technical',
    priority: 'medium',
    updates: [] // Add this line
  });

  // Add useMemo for filtered queries
  const filteredQueries = useMemo(() => {
    if (!queries) return [];
    
    return queries.filter(query => {
      const matchesSearch = query.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || query.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [queries, searchTerm, statusFilter]);

  // Fetch queries on component mount
  useEffect(() => {
    const initializeQueries = async () => {
      if (!isAuthenticated || !user?._id) {
        console.log('Waiting for authentication...', { isAuthenticated, userId: user?._id });
        return;
      }
      
      console.log('User authenticated, fetching queries...', user._id);
      await fetchQueries();
    };

    initializeQueries();
  }, [user, isAuthenticated]);

  const fetchQueries = async () => {
    if (!user?._id) {
      console.log('No user ID found, aborting fetch');
      return;
    }

    try {
      setLoading(true);
      const response = await queryService.getStudentQueries();
      console.log('Query response:', response);

      if (response?.data) {
        // Transform the data to ensure responses array exists
        const transformedData = response.data.map(query => ({
          ...query,
          responses: query.responses || [],
          updates: query.updates || []
        }));
        setQueries(transformedData);
      } else {
        console.warn('No queries found in response');
        setQueries([]);
      }
    } catch (error) {
      console.error('Failed to fetch queries:', error);
      enqueueSnackbar('Failed to fetch queries: ' + (error.message || 'Unknown error'), {
        variant: 'error'
      });
      setQueries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?._id) return; // Add check for user existence

    // Setup WebSocket notifications
    const cleanup = setupWebSocket(user._id, (notification) => {
      enqueueSnackbar(notification.message, { 
        variant: 'info',
        autoHideDuration: 3000
      });
      // Refresh queries
      fetchQueries();
    });

    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [user, enqueueSnackbar]);

  const handleSubmitQuery = async () => {
    try {
      setLoading(true);
      await queryService.submitQuery(newQuery);
      enqueueSnackbar('Query submitted successfully!', { variant: 'success' });
      setOpenNew(false);
      resetForm();
      fetchQueries();
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (query) => {
    setSelectedQuery(query);
    setNewQuery({
      subject: query.subject,
      description: query.description,
      category: query.category,
      priority: query.priority,
    });
    setOpenEdit(true);
  };

  const handleUpdateQuery = async () => {
    if (!selectedQuery?._id) {
      enqueueSnackbar('No query selected for update', { variant: 'error' });
      return;
    }

    try {
      setLoading(true);
      const updatedData = {
        subject: newQuery.subject,
        description: newQuery.description,
        category: newQuery.category,
        priority: newQuery.priority
      };

      const response = await queryService.updateQuery(selectedQuery._id, updatedData);

      if (response.success) {
        const currentTime = new Date().toISOString();
        // Update local state with properly formatted timestamp
        setQueries(queries.map((q) =>
          q._id === selectedQuery._id
            ? {
                ...q,
                ...updatedData,
                updates: [
                  ...(Array.isArray(q.updates) ? q.updates : []),
                  {
                    from: "Student",
                    message: "Query updated",
                    timestamp: currentTime
                  }
                ]
              }
            : q
        ));

        enqueueSnackbar('Query updated successfully', { variant: 'success' });
        setOpenEdit(false);
        resetForm();
      }
    } catch (error) {
      console.error('Update error:', error);
      enqueueSnackbar(error.message || 'Failed to update query', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (query) => {
    setSelectedQuery(query);
    setOpenDelete(true);
  };

  const handleDeleteConfirm = () => {
    setQueries(queries.filter((q) => q.id !== selectedQuery.id));
    setOpenDelete(false);
    setSelectedQuery(null);
  };

  const resetForm = () => {
    setNewQuery({
      subject: "",
      description: "",
      category: "",
      priority: "medium",
    });
    setSelectedQuery(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "success";
      case "in-progress":
        return "warning";
      case "pending":
        return "error";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "rgb(239, 68, 68)";
      case "medium":
        return "rgb(234, 179, 8)";
      case "low":
        return "rgb(34, 197, 94)";
      default:
        return "rgb(107, 114, 128)";
    }
  };

  // Add a loading state for authentication
  if (!isAuthenticated || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="max-w-7xl mx-auto p-6">
      <Paper elevation={0} className="bg-white rounded-xl shadow-sm border">
        {/* Header */}
        <Box className="p-6 border-b bg-gray-50 rounded-t-xl">
          <Box className="flex items-center justify-between">
            <Box className="flex items-center gap-3">
              <QuestionAnswer className="text-blue-600 text-3xl" />
              <Box>
                <Typography
                  variant="h5"
                  className="font-semibold text-gray-800"
                >
                  Support Queries
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create and track your support requests
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenNew(true)}
              className="bg-blue-600 hover:bg-blue-700"
              sx={{ borderRadius: "10px", textTransform: "none" }}
            >
              Create New Query
            </Button>
          </Box>

          {/* Filters */}
          <Box className="mt-6 flex flex-wrap gap-4">
            <TextField
              size="small"
              placeholder="Search queries..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
              InputProps={{
                startAdornment: <Search className="text-gray-400 mr-2" />,
              }}
              sx={{ minWidth: "300px" }}
            />
            <FormControl size="small" sx={{ minWidth: "200px" }}>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Filter by Status"
              >
                <MenuItem value="all">All Queries</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Queries List */}
        <Box className="divide-y divide-gray-100">
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredQueries &&filteredQueries.length > 0 ? (
            filteredQueries.map((query) => (
              <motion.div
                key={query._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <Box className="flex justify-between items-start gap-4">
                  <Box className="flex-1">
                    <Box className="flex items-center gap-3 mb-2 justify-between">
                      <Box className="flex items-center gap-3">
                        <Typography variant="h6" className="font-medium">
                          {query.subject || 'No Subject'}
                        </Typography>
                        <Chip
                          size="small"
                          label={
                            (query.status || 'pending').charAt(0).toUpperCase() +
                            (query.status || 'pending').slice(1)
                          }
                          color={getStatusColor(query.status || 'pending')}
                          sx={{ borderRadius: "6px" }}
                        />
                        <Tooltip title={`Priority: ${query.priority || 'medium'}`}>
                          <Flag
                            sx={{
                              fontSize: 18,
                              color: getPriorityColor(query.priority || 'medium'),
                            }}
                          />
                        </Tooltip>
                      </Box>
                      {/* Action Buttons */}
<Box>
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(query)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(query)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" className="mb-3">
                      {query.description || 'No description provided'}
                    </Typography>
                    <Box className="flex items-center gap-3 text-sm">
                      <Chip
                        size="small"
                        label={query.category}
                        variant="outlined"
                        icon={<Label className="text-xs" />}
                        sx={{ borderRadius: "6px" }}
                      />
                      <Box className="flex items-center gap-1 text-gray-500">
                        <AccessTime sx={{ fontSize: 16 }} />
                        <Typography variant="caption">
                          Created{" "}
                          {new Date(query.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Updates Section with proper timestamp formatting */}
                {Array.isArray(query.updates) && query.updates.length > 0 && (
                  <Box className="mt-4 pl-4 border-l-2 border-blue-100">
                    {query.updates.map((update, index) => (
                      <Box key={index} className="mb-2 last:mb-0">
                        <Typography variant="body2" className="text-gray-600">
                          <span className="font-medium text-blue-600">
                            {update?.from || 'System'}:
                          </span>{" "}
                          {update?.message || 'No message'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {update?.timestamp ? new Date(update.timestamp).toLocaleString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true
                          }) : 'Unknown time'}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Responses Section */}
                {Array.isArray(query.responses) && query.responses.length > 0 && (
                  <Box className="mt-4 pl-4 border-l-2 border-green-100">
                    <Typography variant="subtitle2" className="mb-2 text-gray-700">
                      Responses:
                    </Typography>
                    {query.responses.map((response, index) => (
                      <Box key={index} className="mb-3 last:mb-0">
                        <Typography variant="body2" className="text-gray-600">
                          <span className="font-medium text-green-600">
                            Admin:
                          </span>{" "}
                          {response.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {response.createdAt ? new Date(response.createdAt).toLocaleString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true
                          }) : 'Unknown time'}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </motion.div>
            ))
          ) : (
            <Box className="p-8 text-center">
              <Typography color="text.secondary">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No queries found matching your filters'
                  : 'No queries yet. Create your first query!'}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* New Query Dialog */}
      <Dialog
        open={openNew}
        onClose={() => setOpenNew(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          elevation: 0,
          sx: { borderRadius: "12px" },
        }}
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: "divider", pb: 2 }}>
          <Typography variant="h6">Create New Support Query</Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Box className="space-y-4">
            <TextField
              fullWidth
              label="Subject"
              variant="outlined"
              value={newQuery.subject}
              onChange={(e) =>
                setNewQuery({ ...newQuery, subject: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              variant="outlined"
              value={newQuery.description}
              onChange={(e) =>
                setNewQuery({ ...newQuery, description: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newQuery.category}
                  label="Category"
                  onChange={(e) =>
                    setNewQuery({ ...newQuery, category: e.target.value })
                  }
                >
                  <MenuItem value="technical">Technical</MenuItem>
                  <MenuItem value="academic">Academic</MenuItem>
                  <MenuItem value="placement">Placement</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newQuery.priority}
                  label="Priority"
                  onChange={(e) =>
                    setNewQuery({ ...newQuery, priority: e.target.value })
                  }
                >
                  <MenuItem value="high">High Priority</MenuItem>
                  <MenuItem value="medium">Medium Priority</MenuItem>
                  <MenuItem value="low">Low Priority</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: 1, borderColor: "divider" }}>
          <Button
            onClick={() => setOpenNew(false)}
            variant="outlined"
            sx={{ borderRadius: "8px", textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitQuery}
            variant="contained"
            sx={{ borderRadius: "8px", textTransform: "none" }}
          >
            Submit Query
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Query Dialog */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          elevation: 0,
          sx: { borderRadius: "12px" },
        }}
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: "divider", pb: 2 }}>
          <Typography variant="h6">Edit Query</Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Box className="space-y-4">
            <TextField
              fullWidth
              label="Subject"
              variant="outlined"
              value={newQuery.subject}
              onChange={(e) =>
                setNewQuery({ ...newQuery, subject: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              variant="outlined"
              value={newQuery.description}
              onChange={(e) =>
                setNewQuery({ ...newQuery, description: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newQuery.category}
                  label="Category"
                  onChange={(e) =>
                    setNewQuery({ ...newQuery, category: e.target.value })
                  }
                >
                  <MenuItem value="technical">Technical</MenuItem>
                  <MenuItem value="academic">Academic</MenuItem>
                  <MenuItem value="placement">Placement</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newQuery.priority}
                  label="Priority"
                  onChange={(e) =>
                    setNewQuery({ ...newQuery, priority: e.target.value })
                  }
                >
                  <MenuItem value="high">High Priority</MenuItem>
                  <MenuItem value="medium">Medium Priority</MenuItem>
                  <MenuItem value="low">Low Priority</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: 1, borderColor: "divider" }}>
          <Button
            onClick={() => setOpenEdit(false)}
            variant="outlined"
            sx={{ borderRadius: "8px", textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateQuery}
            variant="contained"
            sx={{ borderRadius: "8px", textTransform: "none" }}
          >
            Update Query
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        PaperProps={{
          elevation: 0,
          sx: { borderRadius: "12px" },
        }}
      >
        <DialogTitle>Delete Query</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this query? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenDelete(false)}
            variant="outlined"
            sx={{ borderRadius: "8px", textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            sx={{ borderRadius: "8px", textTransform: "none" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuerySection;
