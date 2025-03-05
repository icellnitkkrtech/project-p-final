// import React, { useState, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   Button,
//   Divider,
//   Chip,
//   Box,
//   IconButton,
//   Tooltip,
//   CircularProgress,
// } from "@mui/material";
// import { Add, Lock, Edit, Delete } from "@mui/icons-material";
// import SemesterDialog from "./SemesterDialog";

// const AcademicsOverallEdit = ({ data = {}, isLocked, onChange }) => {
//   const [selectedSemester, setSelectedSemester] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [semesters, setSemesters] = useState([]);

//   useEffect(() => {
//     if (data?.semesters) {
//       setSemesters(data.semesters);
//     }
//     setLoading(false);
//   }, [data]);

//   const handleAddSemester = () => {
//     setSelectedSemester(null);
//     setOpenDialog(true);
//   };

//   const handleEditSemester = (semester) => {
//     setSelectedSemester(semester);
//     setOpenDialog(true);
//   };

//   const handleSaveSemester = (semesterData) => {
//     // Check for duplicate semester
//     const isDuplicate = semesters.some(
//       (s) => s.semester === semesterData.semester && s._id !== semesterData._id
//     );
//     if (isDuplicate) {
//       // Use parent error handling
//       onChange({ error: `Semester ${semesterData.semester} already exists` });
//       return;
//     }

//     // Remove _id handling
//     const updatedSemesters = [...semesters];
//     const index = updatedSemesters.findIndex(
//       (s) => s.semester === semesterData.semester
//     );

//     if (index !== -1) {
//       updatedSemesters[index] = { ...updatedSemesters[index], ...semesterData };
//     } else {
//       updatedSemesters.push({
//         ...semesterData,
//       });
//     }

//     setSemesters(updatedSemesters);
//     onChange({ ...data, semesters: updatedSemesters });
//     setOpenDialog(false);
//   };

//   const handleDeleteSemester = (semesterNumber) => {
//     // Add confirmation dialog
//     if (
//       window.confirm(
//         `Are you sure you want to delete Semester ${semesterNumber}?`
//       )
//     ) {
//       const updatedSemesters = semesters.filter(
//         (s) => s.semester !== semesterNumber
//       );
//       setSemesters(updatedSemesters);
//       onChange({ ...data, semesters: updatedSemesters });
//     }
//   };
//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" p={3}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Card>
//       <CardContent>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             mb: 3,
//           }}
//         >
//           <Typography variant="h6">Semester Results</Typography>
//           {isLocked && (
//             <Tooltip title="Results are locked">
//               <Lock color="primary" />
//             </Tooltip>
//           )}
//         </Box>

//         {semesters && semesters.length > 0 ? (
//           <Grid container spacing={2}>
//             {semesters
//               .sort((a, b) => a.semester - b.semester)
//               .map((semester) => (
//                 <Grid item xs={12} md={6} key={`semester-${semester.semester}`}>
//                   <Card variant="outlined">
//                     <CardContent>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                         }}
//                       >
//                         <Typography variant="h6">
//                           Semester {semester.semester}
//                         </Typography>
//                         {!isLocked && !semester.isLocked && (
//                           <Box>
//                             <IconButton
//                               size="small"
//                               onClick={() => handleEditSemester(semester)}
//                             >
//                               <Edit fontSize="small" />
//                             </IconButton>
//                             <IconButton
//                               size="small"
//                               onClick={() =>
//                                 handleDeleteSemester(semester.semester)
//                               }
//                               color="error"
//                             >
//                               <Delete fontSize="small" />
//                             </IconButton>
//                           </Box>
//                         )}
//                         {semester.isLocked && (
//                           <Tooltip title="Verified & Locked">
//                             <Lock fontSize="small" color="primary" />
//                           </Tooltip>
//                         )}
//                       </Box>

//                       <Typography variant="h5" color="primary" sx={{ my: 1 }}>
//                         SGPA: {semester.sgpa}
//                       </Typography>

//                       {semester.backlogs?.length > 0 && (
//                         <Box sx={{ mt: 2 }}>
//                           <Typography variant="subtitle2" color="error">
//                             Backlogs ({semester.backlogs.length})
//                           </Typography>
//                           <Box sx={{ mt: 1 }}>
//                             {semester.backlogs.map((backlog, index) => (
//                               <Chip
//                                 key={index}
//                                 label={`${backlog.subjectCode} - ${backlog.status}`}
//                                 color={
//                                   backlog.status === "cleared"
//                                     ? "success"
//                                     : "error"
//                                 }
//                                 size="small"
//                                 sx={{ mr: 1, mb: 1 }}
//                               />
//                             ))}
//                           </Box>
//                         </Box>
//                       )}
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//           </Grid>
//         ) : (
//           <Typography
//             variant="body1"
//             color="text.secondary"
//             sx={{ textAlign: "center", py: 3 }}
//           >
//             No semester results added yet
//           </Typography>
//         )}

//         {!isLocked && (
//           <Button
//             startIcon={<Add />}
//             variant="contained"
//             onClick={handleAddSemester}
//             sx={{ mt: 3 }}
//           >
//             Add Semester
//           </Button>
//         )}

//         <SemesterDialog
//           open={openDialog}
//           onClose={() => setOpenDialog(false)}
//           onSave={handleSaveSemester}
//           semester={selectedSemester}
//           existingSemesters={semesters?.map((s) => s.semester) || []}
//         />
//       </CardContent>
//     </Card>
//   );
// };

// export default AcademicsOverallEdit;
