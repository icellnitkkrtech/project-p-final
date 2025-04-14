import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  FormControl,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "../../../config/axios";

const CompanySignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    website: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    try {
      const response = await axios.post("/company/register", {
        companyName: formData.companyName,
        email: formData.email,
        website: formData.website,
        password: formData.password,
      });

      if (response.data.statusCode === 201) {
        // Registration successful, navigate to login
        navigate("/auth/recruiter/login");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Company Registration
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create your company account
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
                name="companyName"
                label="Company Name"
                variant="outlined"
                value={formData.companyName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
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
                name="website"
                label="Website URL"
                variant="outlined"
                value={formData.website}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
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
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? "Registering..." : "Register"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Button
                  color="primary"
                  onClick={() => navigate("/auth/recruiter/login")}
                  disabled={loading}
                >
                  Sign in
                </Button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanySignup;
