import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Refresh,
  FilterList,
  Sort,
  Description,
} from "@mui/icons-material";
import ApplicationDetailView from "./ApplicationDetailView";
import ApplicationSkeleton from "./ApplicationSkeleton";
import OfferLetterView from "./OfferLetterView";
import { Alert } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import {
  Box,
  Tooltip,
  IconButton,
  Typography,
  Menu,
  Chip,
  MenuItem,
  Button,
} from "@mui/material";

const ApplicationsSection = () => {
  const { student } = useOutletContext();
  const studentId = student._id;
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "appliedAt",
    direction: "desc",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [viewingOffer, setViewingOffer] = useState(null);
  const itemsPerPage = 10;

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/student/applications/${studentId}`);
      setApplications(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [studentId]);

  const getStatusClass = (status) => {
    const statusClasses = {
      applied: "bg-amber-100 text-amber-800 border border-amber-200",
      shortlisted: "bg-blue-100 text-blue-800 border border-blue-200",
      "in-process": "bg-purple-100 text-purple-800 border border-purple-200",
      selected: "bg-emerald-100 text-emerald-800 border border-emerald-200",
      rejected: "bg-rose-100 text-rose-800 border border-rose-200",
      "on-hold": "bg-gray-100 text-gray-800 border border-gray-200",
    };
    return statusClasses[status] || statusClasses.applied;
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
    setAnchorEl(null);
  };
  const handleOfferResponseSubmitted = (updatedApplication) => {
    // Update the application in the list
    setApplications(
      applications.map((app) =>
        app._id === updatedApplication._id ? updatedApplication : app
      )
    );
  };
  const filteredApplications = applications
    .filter((app) => {
      if (filter === "all") return true;
      return app.status === filter;
    })
    .filter(
      (app) =>
        app.placementDrive?.placementDrive_title
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        app.placementDrive?.companyDetails?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (sortConfig.key === "company") {
        return sortConfig.direction === "asc"
          ? (a.placementDrive?.companyDetails?.name || "").localeCompare(
              b.placementDrive?.companyDetails?.name || ""
            )
          : (b.placementDrive?.companyDetails?.name || "").localeCompare(
              a.placementDrive?.companyDetails?.name || ""
            );
      }
      return sortConfig.direction === "asc"
        ? aVal > bVal
          ? 1
          : -1
        : aVal < bVal
          ? 1
          : -1;
    });

  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  const statusFilters = [
    "all",
    "applied",
    "shortlisted",
    "in-process",
    "selected",
    "rejected",
    "on-hold",
  ];

  const headers = [
    { label: "Company", key: "company" },
    { label: "Position", key: "position" },
    { label: "Status", key: "status" },
    { label: "Applied On", key: "appliedAt" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-lg min-h-screen md:min-h-0"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="p-4 md:px-6 md:py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Typography variant="h5" component="h1" className="font-semibold">
                Placement Applications
              </Typography>
              <Chip
                label={`${applications.length} Total`}
                color="primary"
                size="small"
                variant="outlined"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" />
              </div>
              <Tooltip title="Refresh">
                <IconButton onClick={fetchApplications} size="small">
                  <Refresh />
                </IconButton>
              </Tooltip>
              <Tooltip title="Sort">
                <IconButton
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  size="small"
                >
                  <Sort />
                </IconButton>
              </Tooltip>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {statusFilters.map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap flex-shrink-0
                  ${
                    filter === status
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sort Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {headers.map((header) => (
          <MenuItem
            key={header.key}
            onClick={() => handleSort(header.key)}
            selected={sortConfig.key === header.key}
          >
            {header.label}
            {sortConfig.key === header.key && (
              <span className="ml-2">
                {sortConfig.direction === "asc" ? "↑" : "↓"}
              </span>
            )}
          </MenuItem>
        ))}
      </Menu>

      {/* Content */}
      <div className="p-4 md:p-6">
        {loading ? (
          <ApplicationSkeleton count={5} />
        ) : error ? (
          <Alert severity="error" className="my-4">
            {error}
          </Alert>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-8">
            <Typography color="textSecondary">No applications found</Typography>
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="block md:hidden space-y-4">
              {paginatedApplications.map((app) => (
                <div
                  key={app._id}
                  onClick={() => setActiveTab(app)}
                  className="bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Typography variant="subtitle1" className="font-medium">
                        {app.placementDrive?.companyDetails?.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {app.placementDrive?.placementDrive_title}
                      </Typography>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusClass(app.status)}`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <Typography variant="caption" color="textSecondary">
                    Applied: {new Date(app.appliedAt).toLocaleDateString()}
                  </Typography>
                  {app.offerDetails && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingOffer(app);
                      }}
                      startIcon={<Description />}
                    >
                      View Offer
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    {headers.map((header) => (
                      <th
                        key={header.key}
                        onClick={() => handleSort(header.key)}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-1">
                          {header.label}
                          {sortConfig.key === header.key && (
                            <span>
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedApplications.map((app) => (
                    <tr
                      key={app._id}
                      onClick={() => setActiveTab(app)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        {app.placementDrive?.companyDetails?.name}
                      </td>
                      <td className="px-6 py-4">
                        {app.placementDrive?.placementDrive_title}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusClass(app.status)}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      {app.offerDetails && (
                        <td className="px-6 py-4">
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingOffer(app);
                            }}
                          >
                            View Offer
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`hidden md:block px-3 py-1 rounded ${
                        currentPage === i + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <span className="md:hidden px-3 py-1">
                    {currentPage} of {totalPages}
                  </span>
                </div>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Application Detail Modal */}
      <AnimatePresence>
        {activeTab && (
          <ApplicationDetailView
            application={activeTab}
            onClose={() => setActiveTab(null)}
          />
        )}
      </AnimatePresence>

      {viewingOffer && (
        <OfferLetterView
          application={viewingOffer}
          open={Boolean(viewingOffer)}
          onClose={() => setViewingOffer(null)}
          onResponseSubmitted={handleOfferResponseSubmitted}
        />
      )}
    </motion.div>
  );
};

export default ApplicationsSection;
