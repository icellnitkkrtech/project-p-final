import { Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import DataTable from '../../common/DataTable';

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'companyName', headerName: 'Company', width: 200 },
        { field: 'role', headerName: 'Role', width: 150 },
        // { field: 'package', headerName: 'Package (LPA)', width: 150 },
        // { field: 'appliedCount', headerName: 'Applied', width: 100 },
        // { field: 'selectedCount', headerName: 'Selected', width: 100 },
        { field: 'status', headerName: 'Status', width: 120 },
        { field: 'startDate', headerName: 'Start Date', width: 120 },
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
  return (
    <DataTable
        columns={[
          ...columns,
          {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
              <Button
                variant="contained"
                onClick={() => handleViewPlacement()}
              >
                View
              </Button>
            ),
          },
        ]}
        data={placements}
        pagination={{ ...mockPagination, total: placements.length }}
      />
  );
};

export default PlacementTable;