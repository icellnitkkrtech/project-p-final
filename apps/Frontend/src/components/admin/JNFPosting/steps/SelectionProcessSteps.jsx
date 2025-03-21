import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Paper,
  Stack,
  useTheme,
  Card,
  IconButton,
  Collapse,
  Chip,
  Button,
  MenuItem,
  Menu,
  Tooltip,
  Avatar
} from '@mui/material';
import { 
  WorkOutlined as JobIcon,
  ExpandMore as ExpandMoreIcon, 
  ExpandLess as ExpandLessIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon
} from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';

// Sortable round item component
const SortableRoundItem = ({ round, index, profileId, roundDetail, handleDeleteRound, selectionProcessData }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: `${round.type}-${index}` });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{ mx: 1, position: 'relative' }}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 120,
      }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              backgroundColor: roundDetail.color || 'primary.main',
              border: '2px solid',
              borderColor: 'background.paper',
              fontSize: '1rem',
              fontWeight: 'bold',
              color: '#fff',
              position: 'relative'
            }}
          >
            {index + 1}
          </Avatar>
          
          <Box
            {...attributes}
            {...listeners} 
            sx={{ 
              position: 'absolute', 
              top: -8,
              left: -8,
              cursor: 'grab',
              display: 'flex',
              '&:active': { cursor: 'grabbing' }
            }}
          >
            <DragIcon sx={{ opacity: 0.6 }} />
          </Box>
          
          <Tooltip title="Remove Round">
            <IconButton
              size="small"
              color="error"
              sx={{
                position: 'absolute',
                top: -8,
                right: -8,
                width: 24,
                height: 24,
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'error.light', color: 'white' }
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteRound(profileId, index);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Typography
          variant="caption"
          sx={{
            mt: 1,
            textAlign: 'center',
            fontWeight: 500,
            lineHeight: 1.2
          }}
        >
          {roundDetail.label}
        </Typography>
        
        {/* Centered connector line */}
        {index < selectionProcessData.rounds.length - 1 && (
          <Box
            sx={{
              position: 'absolute',
              left: '50%',        // Center from the left edge of the round
              width: 70,          // Adjust width
              height: 2,
              bgcolor: 'divider',
              top: 30,            // Vertical position
              transform: 'translateX(50%)'  // Shift right by half the width
            }}
          />
        )}
      </Box>
    </Box>
  );
};

const SelectionProcessSteps = ({ formData, handleSelectionProcess }) => {
  const theme = useTheme();
  
  // State to track expanded profiles (all collapsed by default)
  const [expandedProfiles, setExpandedProfiles] = useState({});
  
  // State for new round selection dropdown
  const [addingRoundForProfile, setAddingRoundForProfile] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  
  // State for active dragging item
  const [activeId, setActiveId] = useState(null);
  
  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Toggle expansion of a profile
  const toggleProfileExpansion = (profileId) => {
    setExpandedProfiles(prev => ({
      ...prev,
      [profileId]: !prev[profileId]
    }));
  };
  
  // Checkbox options for selection process rounds
  const roundOptions = [
    { value: 'resumeShortlisting', label: 'Resume Shortlisting', color: '#4CAF50' },
    { value: 'prePlacementTalk', label: 'Pre-Placement Talk', color: '#2196F3' },
    { value: 'groupDiscussion', label: 'Group Discussion', color: '#9C27B0' },
    { value: 'onlineTest', label: 'Online Test', color: '#FF9800' },
    { value: 'aptitudeTest', label: 'Aptitude Test', color: '#E91E63' },
    { value: 'technicalTest', label: 'Technical Test', color: '#3F51B5' },
    { value: 'technicalInterview', label: 'Technical Interview', color: '#009688' },
    { value: 'hrInterview', label: 'HR Interview', color: '#F44336' }
  ];

  // Get round details by type
  const getRoundDetails = (roundType) => {
    return roundOptions.find(option => option.value === roundType) || 
      { value: roundType, label: roundType, color: '#757575' };
  };
  
  // Handler for opening new round menu
  const handleOpenAddRound = (event, profileId) => {
    setAnchorEl(event.currentTarget);
    setAddingRoundForProfile(profileId);
  };
  
  // Handler for closing new round menu
  const handleCloseAddRound = () => {
    setAnchorEl(null);
    setAddingRoundForProfile(null);
  };
  
  // Add a new round
  const handleAddRound = (profileId, roundType) => {
    // Get existing selection process data
    const profileData = formData.selectionProcessForProfiles.find(
      p => p.profileId === profileId
    ) || { rounds: [], expectedRecruits: '', tentativeDate: '' };
    
    // Check if round already exists
    if (!profileData.rounds.some(r => r.type === roundType)) {
      // Add new round to the end
      handleSelectionProcess(profileId, roundType, true);
    }
    
    handleCloseAddRound();
  };
  
  // Delete a round
  const handleDeleteRound = (profileId, roundIndex) => {
    const profileData = formData.selectionProcessForProfiles.find(
      p => p.profileId === profileId
    );
    
    if (profileData && profileData.rounds.length > roundIndex) {
      const roundType = profileData.rounds[roundIndex].type;
      handleSelectionProcess(profileId, roundType, false);
    }
  };
  
  // Handle drag start
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };
  
  // Handle drag end for reordering
  const handleDragEnd = (event, profileId) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over || !active) return;
    
    if (active.id !== over.id) {
      try {
        // Get the profile data
        const profileData = formData.selectionProcessForProfiles.find(
          p => p.profileId === profileId
        );
        
        if (profileData) {
          // Extract indices directly from the sortable IDs
          const activeIdParts = String(active.id).split('-');
          const overIdParts = String(over.id).split('-');
          
          if (activeIdParts.length >= 2 && overIdParts.length >= 2) {
            const activeIndex = parseInt(activeIdParts[1], 10);
            const overIndex = parseInt(overIdParts[1], 10);
            
            if (!isNaN(activeIndex) && !isNaN(overIndex)) {
              // Separate other rounds entry if it exists
              const otherRoundsEntry = profileData.rounds.find(r => r.type === 'otherRounds');
              const regularRounds = profileData.rounds.filter(r => r.type !== 'otherRounds');
              
              // Create a new array with the updated order
              const reorderedRounds = arrayMove(regularRounds, activeIndex, overIndex);
              
              // Add back the other rounds entry if it exists
              const finalRounds = otherRoundsEntry 
                ? [...reorderedRounds, otherRoundsEntry] 
                : reorderedRounds;
              
              // Create a complete updated rounds array
              const updatedRounds = finalRounds.map((round, idx) => ({
                ...round,
                roundNumber: idx + 1
              }));
              
              console.log("Reordered rounds:", updatedRounds);
              
              // Call the handler with explicit and complete data
              handleSelectionProcess(profileId, 'updateAllRounds', updatedRounds);
            }
          }
        }
      } catch (error) {
        console.error("Error during drag end:", error);
      }
    }
  };

  // Get available rounds (not yet selected)
  const getAvailableRounds = (profileId) => {
    const profileData = formData.selectionProcessForProfiles.find(
      p => p.profileId === profileId
    );
    
    const selectedRoundTypes = profileData ? 
      profileData.rounds.map(round => round.type) : [];
    
    return roundOptions.filter(option => 
      !selectedRoundTypes.includes(option.value) && option.value !== 'otherRounds'
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h5" fontWeight={600} gutterBottom color="primary">
        Selection Process
      </Typography>

      <Stack spacing={2}>
        {formData.jobProfiles.map((jobProfile, profileIndex) => {
          // Find the corresponding selectionProcess entry
          const selectionProcessData = formData.selectionProcessForProfiles.find(
            item => item.profileId === jobProfile.profileId
          ) || { rounds: [], expectedRecruits: '', tentativeDate: '' };
          
          // Find the other rounds entry if it exists
          const otherRoundsEntry = selectionProcessData.rounds.find(round => round.type === 'otherRounds');
          
          // Check if this profile is expanded
          const isExpanded = expandedProfiles[jobProfile.profileId] || false;
          
          return (
            <Card
              key={jobProfile.profileId}
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: profileIndex * 0.1 }}
              sx={{
                p: 0,
                overflow: 'hidden',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              {/* Header for job profile with toggle button */}
              <Box
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
                onClick={() => toggleProfileExpansion(jobProfile.profileId)}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <JobIcon color="primary" />
                  <Typography variant="subtitle1" fontWeight={600} color="primary.dark">
                    Job Profile {profileIndex + 1}: {jobProfile.designation || 'New Position'}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  color="primary"
                  sx={{ transition: 'transform 0.3s' }}
                >
                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
              
              <Collapse in={isExpanded}>
                <Box sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    {/* Selection Rounds - New Circle UI */}
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        border: '1px dashed', 
                        borderColor: 'divider'
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 2
                      }}>
                        <Typography variant="h6" color="primary">
                          Selection Rounds
                        </Typography>
                        
                        <Button 
                          variant="outlined"
                          color="primary"
                          startIcon={<AddIcon />}
                          onClick={(e) => handleOpenAddRound(e, jobProfile.profileId)}
                          disabled={getAvailableRounds(jobProfile.profileId).length === 0}
                        >
                          Add Round
                        </Button>
                        
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl && addingRoundForProfile === jobProfile.profileId)}
                          onClose={handleCloseAddRound}
                        >
                          {getAvailableRounds(jobProfile.profileId).map((option) => (
                            <MenuItem 
                              key={option.value} 
                              onClick={() => handleAddRound(jobProfile.profileId, option.value)}
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                gap: 1
                              }}
                            >
                              <Box 
                                sx={{ 
                                  width: 16, 
                                  height: 16, 
                                  borderRadius: '50%', 
                                  bgcolor: option.color || 'primary.main' 
                                }} 
                              />
                              {option.label}
                            </MenuItem>
                          ))}
                        </Menu>
                      </Box>
                      
                      {selectionProcessData.rounds.length === 0 ? (
                        <Box sx={{ 
                          p: 3, 
                          textAlign: 'center', 
                          bgcolor: 'action.hover',
                          borderRadius: 1
                        }}>
                          <Typography color="text.secondary">
                            No selection rounds added yet. Click "Add Round" to get started.
                          </Typography>
                        </Box>
                      ) : (
                        <DndContext 
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragStart={handleDragStart}
                          onDragEnd={(event) => handleDragEnd(event, jobProfile.profileId)}
                          modifiers={[restrictToHorizontalAxis]}
                        >
                          <Box 
                            sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                              overflowX: 'auto',
                              py: 2,
                              '&::-webkit-scrollbar': { height: '8px' },
                              '&::-webkit-scrollbar-thumb': { 
                                backgroundColor: 'rgba(0,0,0,0.2)', 
                                borderRadius: '4px' 
                              }
                            }}
                          >
                            <SortableContext 
                              items={selectionProcessData.rounds
                                .filter(round => round.type !== 'otherRounds')
                                .map((round, index) => `${round.type}-${index}`)}
                              strategy={horizontalListSortingStrategy}
                            >
                              {selectionProcessData.rounds
                                .filter(round => round.type !== 'otherRounds')
                                .map((round, index) => {
                                  const roundDetail = getRoundDetails(round.type);
                                  
                                  return (
                                    <SortableRoundItem
                                      key={`${round.type}-${index}`}
                                      round={round}
                                      index={index}
                                      profileId={jobProfile.profileId}
                                      roundDetail={roundDetail}
                                      handleDeleteRound={handleDeleteRound}
                                      selectionProcessData={selectionProcessData}
                                    />
                                  );
                                })}
                            </SortableContext>
                          </Box>
                        </DndContext>
                      )}

                      {selectionProcessData.rounds.length > 0 && (
                        <Box sx={{ 
                          mt: 2,
                          pt: 2,
                          borderTop: '1px dashed',
                          borderColor: 'divider'
                        }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Instructions for Candidates:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Please prepare for the selection process consisting of {selectionProcessData.rounds.length} rounds as shown above.
                            The rounds will proceed in the order displayed. You can find more information about each round in the job description.
                          </Typography>
                        </Box>
                      )}
                    </Paper>

                    {/* Other Rounds */}
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        border: '1px dashed', 
                        borderColor: 'divider'
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom>
                        Other Rounds (if any)
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={otherRoundsEntry?.details || ''}
                        onChange={(e) => handleSelectionProcess(
                          jobProfile.profileId,
                          'otherRounds',
                          e.target.value
                        )}
                        variant="outlined"
                        placeholder="Enter details of additional selection rounds if any"
                      />
                    </Paper>

                    {/* Expected Recruits & Tentative Date */}
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        border: '1px dashed', 
                        borderColor: 'divider'
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom>
                        Recruitment Details
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Expected Number of Recruits"
                            type="number"
                            InputProps={{ inputProps: { min: 1 } }}
                            value={selectionProcessData.expectedRecruits || ''}
                            onChange={(e) => handleSelectionProcess(
                              jobProfile.profileId,
                              'expectedRecruits',
                              e.target.value
                            )}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Tentative Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={selectionProcessData.tentativeDate ? 
                              new Date(selectionProcessData.tentativeDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => handleSelectionProcess(
                              jobProfile.profileId,
                              'tentativeDate',
                              e.target.value
                            )}
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Stack>
                </Box>
              </Collapse>

              {/* Summary when collapsed */}
              {!isExpanded && (
                <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary">
                    {selectionProcessData.rounds.length} rounds selected
                    {selectionProcessData.expectedRecruits && 
                      `, ${selectionProcessData.expectedRecruits} expected recruits`}
                    {selectionProcessData.tentativeDate && 
                      `, tentative date: ${new Date(selectionProcessData.tentativeDate).toLocaleDateString()}`}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    {selectionProcessData.rounds.map((round, idx) => {
                      if (round.type === 'otherRounds') return null;
                      const roundDetail = getRoundDetails(round.type);
                      return (
                        <Chip 
                          key={idx}
                          label={`${idx+1}. ${roundDetail.label}`}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            fontSize: '0.75rem',
                            borderColor: roundDetail.color,
                            color: roundDetail.color,
                          }}
                        />
                      );
                    })}
                  </Box>
                </Box>
              )}
            </Card>
          );
        })}
      </Stack>
    </motion.div>
  );
};

export default SelectionProcessSteps;