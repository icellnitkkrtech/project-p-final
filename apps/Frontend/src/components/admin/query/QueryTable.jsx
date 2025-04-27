import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ChatIcon from '@mui/icons-material/Chat';
import DeleteIcon from '@mui/icons-material/Delete';

const QueryTable = ({ queries, onViewDetails, onDelete, activeTab }) => {
  return (
    <TableContainer component={Paper} sx={{ overflowY: "auto", maxHeight: "calc(100vh - 140px)" }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {activeTab === "student" ? (
              <>
                <TableCell><b>Roll No</b></TableCell>
                <TableCell><b>Name</b></TableCell>
              </>
            ) : (
              <>
                <TableCell><b>Company</b></TableCell>
                <TableCell><b>Email</b></TableCell>
              </>
            )}
            <TableCell><b>Status</b></TableCell>
            <TableCell><b>Actions</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {queries.map((query) => (
            <TableRow key={query.id}>
              {activeTab === "student" ? (
                <>
                  <TableCell>{query.rollNo || 'N/A'}</TableCell>
                  <TableCell>{query.name || 'Unknown'}</TableCell>
                </>
              ) : (
                <>
                  <TableCell>{query.company}</TableCell>
                  <TableCell>{query.email}</TableCell>
                </>
              )}
              <TableCell>
                <span style={{ color: query.reviewed ? "green" : "red" }}>
                  {query.reviewed ? "Reviewed" : "Pending"}
                </span>
              </TableCell>
              <TableCell>
                <IconButton
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => onViewDetails(query)}
                >
                  <ChatIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={() => onDelete(query.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default QueryTable;
