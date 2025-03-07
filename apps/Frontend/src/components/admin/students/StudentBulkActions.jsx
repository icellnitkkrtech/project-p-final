import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid
} from '@mui/material';
import {
  Upload,
  Download,
  Email,
  FilterList,
  GroupAdd
} from '@mui/icons-material';
import { useState } from 'react';

export const StudentBulkActions = ({ onAction, selectedStudents }) => {
  const [filterDialog, setFilterDialog] = useState(false);
  const [emailDialog, setEmailDialog] = useState(false);
  const [filters, setFilters] = useState({
    branch: [],
    year: '',
    cgpa: '',
    status: ''
  });

  return (
    <>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Bulk Actions
              {selectedStudents.length > 0 && (
                <Chip
                  label={`${selectedStudents.length} selected`}
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>
            <Box display="flex" gap={1}>
              <Button
                startIcon={<FilterList />}
                onClick={() => setFilterDialog(true)}
              >
                Filters
              </Button>
              <Button
                startIcon={<Download />}
                onClick={() => onAction('export')}
              >
                Export
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Upload />}
                onClick={() => onAction('import')}
              >
                Import Students
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Email />}
                onClick={() => setEmailDialog(true)}
              >
                Send Email
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GroupAdd />}
                onClick={() => onAction('assign')}
              >
                Assign to Company
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Filter Dialog */}
      <Dialog
        open={filterDialog}
        onClose={() => setFilterDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Filter Students</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Branch</InputLabel>
                <Select
                  multiple
                  value={filters.branch}
                  onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="CSE">Computer Science</MenuItem>
                  <MenuItem value="ECE">Electronics</MenuItem>
                  <MenuItem value="ME">Mechanical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Year</InputLabel>
                <Select
                  value={filters.year}
                  onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                >
                  <MenuItem value="1">First Year</MenuItem>
                  <MenuItem value="2">Second Year</MenuItem>
                  <MenuItem value="3">Third Year</MenuItem>
                  <MenuItem value="4">Fourth Year</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimum CGPA"
                type="number"
                value={filters.cgpa}
                onChange={(e) => setFilters({ ...filters, cgpa: e.target.value })}
                inputProps={{ step: 0.1, min: 0, max: 10 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              onAction('filter', filters);
              setFilterDialog(false);
            }}
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>

      {/* Email Dialog */}
      <Dialog
        open={emailDialog}
        onClose={() => setEmailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Send Bulk Email</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Subject"
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Email Content"
            helperText="Use {{name}} for student name and {{roll}} for roll number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              onAction('email');
              setEmailDialog(false);
            }}
          >
            Send Email
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};