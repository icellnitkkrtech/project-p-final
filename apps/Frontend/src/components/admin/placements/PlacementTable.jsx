import { Table, TableHead, TableRow, TableCell, TableBody, Button, Icon } from '@mui/material';
import DataTable from '../../common/DataTable';
import { useNavigate } from 'react-router-dom';
import { Delete } from '@mui/icons-material';
import placementService from '../../../services/admin/placementService';

    const columns = [
        { field: '_id', headerName: 'ID', width: 90 },
        { field: 'companyName', headerName: 'Company', width: 200 },
        { field: 'role', headerName: 'Role', width: 150 },
        // { field: 'package', headerName: 'Package (LPA)', width: 150 },
        // { field: 'appliedCount', headerName: 'Applied', width: 100 },
        // { field: 'selectedCount', headerName: 'Selected', width: 100 },
        { field: 'status', headerName: 'Status', width: 120 },
        // { 
        //   field: 'location', 
        //   headerName: 'Locations', 
        //   width: 200,
        //   renderCell: (params) => (
        //     <Tooltip title={params.value}>
        //       <span>{params.value}</span>
        //     </Tooltip>
        //   )
        // },
      ];


const PlacementTable = ({ placements, mockPagination }) => {

  
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleDeletePlacement = async (id) => {
    try {
      const response = await placementService.deletePlacement(id);
      console.log(response);
        alert('Placement deleted successfully');
        window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell key={column.field} style={{ minWidth: column.width }}>
              {column.headerName}
            </TableCell>
          ))}
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {placements.map((placement) => (
          <TableRow key={placement._id}>
            <TableCell>{placement._id}</TableCell>
            <TableCell>{placement.companyDetails?.name}</TableCell>
            <TableCell>{placement.jobProfile?.designation}</TableCell>
            <TableCell>{placement.status}</TableCell>
            <TableCell>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleNavigation(`/admin/placements/${placement._id}`)}
              >
                View
              </Button>
              <Delete
              color='error'
              onClick = {() => handleDeletePlacement(placement._id)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PlacementTable;