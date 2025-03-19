import React, { useEffect, useState } from "react";
import { CircularProgress, Typography, Box } from "@mui/material";
import jnfService from '../../../services/admin/jnfService';

const JNFDetails = () => {
    const [jnfDetails, setJnfDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJNFDetails = async () => {
            try {
                setLoading(true);
                const response = await jnfService.getAll();
                setJnfDetails(response || []);
            } catch (error) {
                console.error("Error fetching JNF details:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchJNFDetails();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!jnfDetails || jnfDetails.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography>No JNF details available</Typography>
            </Box>
        );
    }

    return (
        <div>
            {jnfDetails.map((jnf) => (
                <div key={jnf._id}>
                    <h2>{jnf.companyDetails?.name}</h2>
                    <p>{jnf.companyDetails?.description}</p>
                    <p>{jnf.companyDetails?.domain}</p>
                    <p>{jnf.companyDetails?.email}</p>
                    <p>{jnf.companyDetails?.website}</p>
                    <p>{jnf.companyDetails?.companyType}</p>
                    <h3>Job Profiles</h3>
                    {jnf.jobProfiles.map((profile, index) => (
                        <div key={index}>
                            <p>{profile.designation}</p>
                            <p>{profile.jobDescription}</p>
                            <p>{profile.ctc}</p>
                            <p>{profile.takeHome}</p>
                            <p>{profile.perks}</p>
                            <p>{profile.trainingPeriod}</p>
                            <p>{profile.placeOfPosting}</p>
                        </div>
                    ))}
                    <h3>Eligible Branches</h3>
                    <p>B.Tech: {jnf.eligibleBranches.btech.map(branch => branch.name).join(', ')}</p>
                    <p>M.Tech: {jnf.eligibleBranches.mtech.map(branch => branch.department).join(', ')}</p>
                    <h3>Selection Process</h3>
                    <p>{jnf.selectionProcess.resumeShortlisting ? "Resume Shortlisting" : ""}</p>
                    <p>{jnf.selectionProcess.prePlacementTalk ? "Pre Placement Talk" : ""}</p>
                    <p>{jnf.selectionProcess.groupDiscussion ? "Group Discussion" : ""}</p>
                    <p>{jnf.selectionProcess.onlineTest ? "Online Test" : ""}</p>
                    <p>{jnf.selectionProcess.aptitudeTest ? "Aptitude Test" : ""}</p>
                    <p>{jnf.selectionProcess.technicalTest ? "Technical Test" : ""}</p>
                    <p>{jnf.selectionProcess.technicalInterview ? "Technical Interview" : ""}</p>
                    <p>{jnf.selectionProcess.hrInterview ? "HR Interview" : ""}</p>
                    <p>{jnf.selectionProcess.otherRounds}</p>
                    <h3>Bond Details</h3>
                    <p>{jnf.bondDetails}</p>
                    <h3>Point of Contact</h3>
                    {jnf.pointOfContact.map((contact, index) => (
                        <div key={index}>
                            <p>{contact.name}</p>
                            <p>{contact.designation}</p>
                            <p>{contact.mobile}</p>
                            <p>{contact.email}</p>
                        </div>
                    ))}
                    <h3>Additional Info</h3>
                    <p>{jnf.additionalInfo.sponsorEvents}</p>
                    <p>{jnf.additionalInfo.internshipOffered}</p>
                    <p>{jnf.additionalInfo.internshipDuration}</p>
                    <p>{jnf.additionalInfo.contests}</p>
                    <h3>Status</h3>
                    <p>{jnf.status}</p>
                    <h3>Assigned User</h3>
                    <p>{jnf.assignedUser.name}</p>
                    <p>{jnf.assignedUser.email}</p>
                    <p>{jnf.assignedUser.designation}</p>
                    <h3>Drive Status</h3>
                    <p>{jnf.driveStatus}</p>
                </div>
            ))}
        </div>
    );
};

export default JNFDetails;


