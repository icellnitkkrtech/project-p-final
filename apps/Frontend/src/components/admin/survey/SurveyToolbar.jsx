import React from "react";
import {
  Toolbar,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
} from "@mui/material";

const SurveyToolbar = ({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus,
  handleFilterChange,
  handleCreateNew,
}) => {
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    handleFilterChange(); // Automatically trigger filtering on search input change
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    handleFilterChange(); // Automatically trigger filtering on type change
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    handleFilterChange(); // Automatically trigger filtering on status change
  };

  return (
    <Toolbar
      sx={{
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 2,
        padding: 2,
        borderRadius: 2,
      }}
    >
      <Typography color="primary" sx={{paddingBottom:3}} variant="h4">
        Survey Management
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Select
          value={selectedType}
          onChange={handleTypeChange}
          displayEmpty
          variant="outlined"
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="All">All Types</MenuItem>
          <MenuItem value="Feedback">Feedback</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
          <MenuItem value="Career">Career</MenuItem>
        </Select>

        <Select
          value={selectedStatus}
          onChange={handleStatusChange}
          displayEmpty
          variant="outlined"
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="All">All Status</MenuItem>
          <MenuItem value="Published">Published</MenuItem>
          <MenuItem value="Draft">Draft</MenuItem>
        </Select>

        <TextField
          variant="outlined"
          placeholder="Search Surveys"
          size="small"
          value={searchTerm}
          onChange={handleSearchInputChange}
          sx={{ minWidth: 200 }}
        />

        <Button
          variant="contained"
          color="primary"
          size="medium"
          onClick={handleSearchInputChange}
          sx={{ textTransform: "none" }}
        >
          Search
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          size="medium"
          onClick={handleCreateNew}
          sx={{ textTransform: "none" }}
        >
          Create New
        </Button>
      </Box>
    </Toolbar>
  );
};

export default SurveyToolbar;
