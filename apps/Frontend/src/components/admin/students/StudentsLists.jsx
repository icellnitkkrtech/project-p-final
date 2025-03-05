import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  InputAdornment,
  Box 
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { DataTable } from '../../common/ui/Table/DataTable';

const columns = [
  { id: 'rollNo', label: 'Roll No' },
  { id: 'name', label: 'Name' },
  { id: 'branch', label: 'Branch' },
  { id: 'cgpa', label: 'CGPA' },
  { id: 'placementStatus', label: 'Status' },
];

export const StudentList = ({ students, onSearch, onStudentSelect }) => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Student List
          </Typography>
          <TextField
            size="small"
            placeholder="Search students..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            onChange={(e) => onSearch(e.target.value)}
          />
        </Box>
        <DataTable 
          columns={columns}
          data={students}
          onRowClick={(row) => onStudentSelect(row)}
        />
      </CardContent>
    </Card>
  );
};