import React, { useState } from "react";
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
} from "@mui/material";

const QuerySection = () => {
  const [queries, setQueries] = useState(dummyQueries);
  const [openNew, setOpenNew] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [newQuery, setNewQuery] = useState({
    subject: "",
    description: "",
    category: "",
    priority: "medium",
  });

  const handleSubmitQuery = () => {
    const query = {
      id: Date.now().toString(),
      ...newQuery,
      status: "pending",
      createdAt: new Date(),
      updates: [],
    };
    setQueries([query, ...queries]);
    setOpenNew(false);
    resetForm();
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

  const handleUpdateQuery = () => {
    setQueries(
      queries.map((q) =>
        q.id === selectedQuery.id
          ? {
              ...q,
              subject: newQuery.subject,
              description: newQuery.description,
              category: newQuery.category,
              priority: newQuery.priority,
              updates: [
                ...q.updates,
                {
                  from: "Student",
                  message: "Query updated",
                  timestamp: new Date(),
                },
              ],
            }
          : q
      )
    );
    setOpenEdit(false);
    resetForm();
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

  const filteredQueries = queries
    .filter((query) => statusFilter === "all" || query.status === statusFilter)
    .filter(
      (query) =>
        query.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
          {filteredQueries.length > 0 ? (
            filteredQueries.map((query) => (
              <motion.div
                key={query.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <Box className="flex justify-between items-start gap-4">
                  <Box className="flex-1">
                    <Box className="flex items-center gap-3 mb-2 justify-between">
                      <Box className="flex items-center gap-3">
                        <Typography variant="h6" className="font-medium">
                          {query.subject}
                        </Typography>
                        <Chip
                          size="small"
                          label={
                            query.status.charAt(0).toUpperCase() +
                            query.status.slice(1)
                          }
                          color={getStatusColor(query.status)}
                          sx={{ borderRadius: "6px" }}
                        />
                        <Tooltip title={`Priority: ${query.priority}`}>
                          <Flag
                            sx={{
                              fontSize: 18,
                              color: getPriorityColor(query.priority),
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
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className="mb-3"
                    >
                      {query.description}
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

                {/* Updates Section */}
                {query.updates.length > 0 && (
                  <Box className="mt-4 pl-4 border-l-2 border-blue-100">
                    {query.updates.map((update, index) => (
                      <Box key={index} className="mb-2 last:mb-0">
                        <Typography variant="body2" className="text-gray-600">
                          <span className="font-medium text-blue-600">
                            {update.from}:
                          </span>{" "}
                          {update.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(update.timestamp).toLocaleString()}
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
                No queries found matching your filters
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

const dummyQueries = [
  {
    id: "1",
    subject: "Unable to Update Academic Details",
    description:
      "I am trying to update my CGPA in the profile section but getting an error.",
    category: "technical",
    priority: "high",
    status: "pending",
    createdAt: new Date("2025-04-15"),
    updates: [],
  },
  {
    id: "2",
    subject: "Placement Drive Registration Issue",
    description:
      "The system is not allowing me to register for the upcoming Microsoft placement drive.",
    category: "placement",
    priority: "high",
    status: "in-progress",
    createdAt: new Date("2025-04-14"),
    updates: [
      {
        from: "Support Team",
        message:
          "We are looking into this issue. Please provide your student ID.",
        timestamp: new Date("2025-04-14T10:30:00"),
      },
    ],
  },
  {
    id: "3",
    subject: "Certificate Verification Request",
    description:
      "Need verification of my internship certificate for the placement process.",
    category: "academic",
    priority: "medium",
    status: "resolved",
    createdAt: new Date("2025-04-13"),
    updates: [
      {
        from: "Academic Department",
        message:
          "Your certificate has been verified and updated in the system.",
        timestamp: new Date("2025-04-13T15:20:00"),
      },
    ],
  },
];

export default QuerySection;
