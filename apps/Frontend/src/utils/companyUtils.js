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

export const getCompanyStatus = (company) => {
  // Company is inactive if explicitly set or no recent activity
  if (company.status === 'inactive') {
    return 'inactive';
  }

  // Check if company has been active in last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const hasRecentActivity = company.lastVisit > sixMonthsAgo || 
    company.placementDrives?.some(drive => new Date(drive.createdAt) > sixMonthsAgo);

  return hasRecentActivity ? 'active' : 'inactive';
}; 