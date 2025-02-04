import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Refresh, FilterList } from "@mui/icons-material";
import ApplicationDetailView from "./ApplicationDetailView";
import ApplicationSkeleton from "./ApplicationSkeleton";
import { useOutlet, useOutletContext } from "react-router-dom";
const ApplicationsSection = () => {
  const { student, setStudent } = useOutletContext();
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

  const itemsPerPage = 10;

  // Fetch applications
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/student/applications/${studentId}`);
      setApplications(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [studentId]);

  const filteredApplications = applications
    .filter((app) => {
      if (filter === "all") return true;
      return app.status === filter;
    })
    .filter(
      (app) =>
        app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job.company.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
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
            <h3 className="text-xl font-semibold">Job Applications</h3>
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
              <button
                onClick={fetchApplications}
                className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0"
              >
                <Refresh />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {["all", "applied", "accepted", "rejected"].map((status) => (
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

      {/* Content */}
      <div className="p-4 md:p-6">
        {loading ? (
          <ApplicationSkeleton count={5} />
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No applications found
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
                      <h4 className="font-medium">{app.job.company}</h4>
                      <p className="text-sm text-gray-600">{app.job.title}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        app.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : app.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Applied: {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    {["Company", "Position", "Status", "Applied On"].map(
                      (header, index) => (
                        <th
                          key={index}
                          onClick={() => {
                            const key = header.toLowerCase().replace(" ", "");
                            setSortConfig({
                              key,
                              direction:
                                sortConfig.key === key &&
                                sortConfig.direction === "asc"
                                  ? "desc"
                                  : "asc",
                            });
                          }}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedApplications.map((app) => (
                    <tr
                      key={app._id}
                      onClick={() => setActiveTab(app)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4">{app.job.company}</td>
                      <td className="px-6 py-4">{app.job.title}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            app.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : app.status === "accepted"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
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
      {activeTab && (
        <ApplicationDetailView
          application={activeTab}
          onClose={() => setActiveTab(null)}
        />
      )}
    </motion.div>
  );
};

export default ApplicationsSection;
