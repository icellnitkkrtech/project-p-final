import React, { useState, useEffect } from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import { LogoutOutlined } from "@mui/icons-material";
import { Badge } from "@mui/material";
import axiosInstance from "../../config/axios";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Description as DescriptionIcon,
  BusinessCenter as BusinessCenterIcon,
} from "@mui/icons-material";
import { initNotificationSound, playNotificationSound } from '../../utils/notificationSound';

const StudentDashboard = () => {
  // const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const tabs = [
    { id: "profile", label: "Profile", icon: <PersonIcon /> },
    { id: "applications", label: "Job Applications", icon: <WorkIcon /> },
    { id: "resume", label: "Resume", icon: <DescriptionIcon /> },
    { id: "jobs", label: "Available Jobs", icon: <BusinessCenterIcon /> },
    {
      id: "notifications",
      label: "Notifications",
      icon: (
        <Badge badgeContent={unreadCount} color="error" max={99}>
          <NotificationsIcon />
        </Badge>
      ),
    },
    { id: "queries", label: "Support Queries", icon: <QuestionAnswerIcon /> },
  ];

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        // Get student ID from localStorage
        const id = localStorage.getItem("studentId");
        if (!id) {
          throw new Error("No student ID found");
        }

        const response = await axiosInstance.get(`/student/profile/${id}`);
        setStudent(response.data.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch student data"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, []);

  // Initialize audio on component mount
  useEffect(() => {
    initNotificationSound();
  }, []);

  useEffect(() => {
    if (!student?._id) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await axiosInstance.get('/notifications/unread/count');
        const newCount = response.data.count || 0;
        
        // Only play sound if count increased and document is visible
        if (newCount > unreadCount) {
          playNotificationSound();
        }
        
        setUnreadCount(newCount);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    // Initial fetch
    fetchUnreadCount();

    // Set up polling interval (every 30 seconds)
    const intervalId = setInterval(fetchUnreadCount, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [student, unreadCount]);

  const handleLogout = () => {
    // Clear all localStorage items
    localStorage.removeItem("studentId");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    // Redirect to login page
    navigate("/auth/student/login");
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/student/${tabId}`);
    setIsSidebarOpen(false);
    
    // Reset unread count when visiting notifications tab
    if (tabId === 'notifications') {
      setUnreadCount(0);
      // Mark notifications as read in backend
      axiosInstance.post('/notifications/mark-read')
        .catch(error => console.error('Error marking notifications as read:', error));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md bg-white shadow-lg hover:bg-gray-50 transition-colors"
        >
          {isSidebarOpen ? (
            <CloseIcon className="h-6 w-6 text-gray-600" />
          ) : (
            <MenuIcon className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex h-screen overflow-hidden">
        <aside
          className={`fixed lg:static top-0 left-0 h-full bg-white shadow-lg z-20
        transform transition-transform duration-300 ease-in-out
        w-64 flex-shrink-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
            <p className="text-gray-600 mt-1 truncate">
              Welcome, {student?.personalInfo?.name}
            </p>
          </div>
          <nav className="mt-6 px-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  w-full px-4 py-3 mb-2 rounded-lg
                  flex items-center transition-colors duration-200
                  ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <LogoutOutlined />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-8 lg:p-10">
          <div className="max-w-7xl mx-auto">
            <Outlet context={{ student, setStudent }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
