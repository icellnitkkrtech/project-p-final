export const getRecruitmentStatus = (company) => {
  // Check if company has any JNFs
  if (!company.JNFs || company.JNFs.length === 0) {
    return 'inactive'; // No JNF filed yet
  }

  // Check for active placement drives
  const hasActiveDrive = company.JNFs.some(jnf => 
    jnf.placementDrive && jnf.placementDrive.status === 'inProgress'
  );
  if (hasActiveDrive) {
    return 'ongoing';
  }

  // Check for upcoming drives (JNF filed but drive not started)
  const hasUpcomingDrive = company.JNFs.some(jnf => 
    !jnf.placementDrive || jnf.placementDrive.status === 'upcoming'
  );
  if (hasUpcomingDrive) {
    return 'upcoming';
  }

  // If all drives are completed
  const allDrivesCompleted = company.JNFs.every(jnf => 
    jnf.placementDrive && jnf.placementDrive.status === 'completed'
  );
  if (allDrivesCompleted) {
    return 'completed';
  }

  return 'upcoming'; // Default status
}; 