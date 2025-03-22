import React from "react";
import { Box, Tabs, Tab, Button } from "@mui/material";

const NFHeader = ({ tab, setTab, onCreate, title }) => {
  const statuses = ['all', 'approved', 'pending', 'draft', 'rejected'];

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        textColor="primary"
        indicatorColor="primary"
      >
        {statuses.map((status) => (
          <Tab
            key={status}
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            value={status}
          />
        ))}
      </Tabs>

      <Button variant="contained" onClick={onCreate}>
        Create {title}
      </Button>
    </Box>
  );
};

export default NFHeader;
