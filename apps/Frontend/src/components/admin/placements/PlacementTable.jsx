import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Paper,
  TableContainer,
  Chip,
  Tooltip,
  IconButton,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { Visibility, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import placementService from "../../../services/admin/placementService";

const PlacementTable = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlacementId, setSelectedPlacementId] = useState(null);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const data = await placementService.getAllPlacements();
        setPlacements(data);
      } catch (err) {
        enqueueSnackbar("Error fetching placements", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchPlacements();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleDeleteClick = (id) => {
    setSelectedPlacementId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPlacementId) return;
    try {
      await placementService.deletePlacement(selectedPlacementId);
      setPlacements(placements.filter((p) => p._id !== selectedPlacementId));
      enqueueSnackbar("Placement deleted successfully", { variant: "success" });
      setDeleteDialogOpen(false);
    } catch (error) {
      enqueueSnackbar("Error deleting placement", { variant: "error" });
    }
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: 450, overflowY: "auto" }}>
        <Table stickyHeader>
          {/* Table Head - Always Visible */}
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Company</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Role</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* Show Loading inside the table */}
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: "center", py: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Loading Placements...</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : placements.length === 0 ? (
              // No Data Message (inside Table Body)
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: "center", py: 3 }}>
                  <Typography color="textSecondary">No placements found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              // Display Placements when available
              placements.map((placement) => (
                <TableRow key={placement._id} hover>
                  <TableCell sx={{ textAlign: "center" }}>{placement._id}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{placement.companyDetails?.name}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{placement.jobProfile?.designation}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Chip
                      label={placement.status}
                      size="small"
                      color={
                        placement.status === "inProgress"
                          ? "info"
                          : placement.status === "closed"
                          ? "suceess"
                          : placement.status === "hold"
                          ? "warning"
                          : "error"
                      }
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Tooltip title="View Placement">
                      <IconButton color="primary" onClick={() => handleNavigation(`/admin/placements/${placement._id}`)}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Placement">
                      <IconButton color="error" onClick={() => handleDeleteClick(placement._id)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Are you sure you want to delete this placement?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PlacementTable;