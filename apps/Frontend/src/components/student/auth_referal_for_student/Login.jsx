import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  FormControl,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "../axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Add this useEffect to check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const studentId = localStorage.getItem("studentId");
      const authToken = localStorage.getItem("authToken");

      if (studentId && authToken) {
        // If already authenticated, redirect to dashboard
        navigate("/student");
      }
    };

    checkAuth();
  }, [navigate]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate email domain
    const emailRegex = /^[a-zA-Z0-9._%+-]+@nitkkr\.ac\.in$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please use your NIT Kurukshetra email (@nitkkr.ac.in)");
      setLoading(false);
      return;
    }

    try {
      // Step 1: User Authentication
      const loginResponse = await axios.post("/user/login", formData);

      if (loginResponse.data.statusCode === 200) {
        const { user } = loginResponse.data.data;

        // Verify user role
        if (user.user_role !== "student") {
          setError("Access denied. Only students can login here.");
          setLoading(false);
          return;
        }

        // Step 2: Fetch Student Profile
        const studentResponse = await axios.get(
          `/student/profile/user/${user._id}`
        );

        // console.log(studentResponse);
        if (studentResponse.data.statusCode === 200) {
          const studentData = studentResponse.data.data;
          // Store necessary data in localStorage or context if needed
          localStorage.setItem("authToken", loginResponse.data.data.authToken);
          localStorage.setItem("studentId", studentData._id);

          // Navigate to student dashboard
          navigate(`/student`);
        } else {
          setError("Student profile not found");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate("/auth/student/signup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Student Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in with your email and password
          </p>
        </div>

        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <FormControl fullWidth>
              <TextField
                id="email"
                name="email"
                label="Email Address"
                variant="outlined"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                id="password"
                name="password"
                label="Password"
                variant="outlined"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </FormControl>
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              startIcon={
                loading && <CircularProgress size={20} color="inherit" />
              }
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <Button
              type="button"
              fullWidth
              variant="outlined"
              color="primary"
              size="large"
              onClick={handleSignUp}
              disabled={loading}
            >
              Create New Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
