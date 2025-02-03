import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, FormControl, Alert } from "@mui/material";

const Login = () => {
  const [companyId, setCompanyId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!companyId.trim()) {
      setError("Please enter a company ID");
      return;
    }
    // Temporary navigation with company ID
    navigate(`/company/${companyId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Temporary Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter Company ID to continue
          </p>
        </div>

        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <FormControl fullWidth>
            <TextField
              id="companyId"
              label="company ID"
              variant="outlined"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              required
            />
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
