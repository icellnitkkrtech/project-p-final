import React from "react";
import { Box, TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box display="flex" alignItems="center" borderRadius={1} px={2}>
      <TextField
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ ml: 1, flex: 1 }}
      />
      <IconButton>
        <SearchIcon color="primary"/>
      </IconButton>
    </Box>
  );
};

export default SearchBar;
