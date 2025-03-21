// import { useState, useEffect } from "react";
// import jnfDetails from "../../components/admin/jnfManagement/jnfDetails";

// function useJNFData(selectedJNFId) {
//   const [formData, setFormData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   // Add state to manage JNF list
//   const [jnfList, setJnfList] = useState(jnfDetails);

//   useEffect(() => {
//     const fetchData = () => {
//       try {
//         setLoading(true);
//         const data = jnfList.find((jnf) => jnf.id === selectedJNFId);
//         if (!data) {
//           throw new Error("JNF not found");
          
//         }
//         setFormData({
//           company: data.name || "",
//           email: data.email || "",
//           website: data.website || "",
//           companyType: data.companyType || "",
//           domain: data.domain || "",
//           description: data.description || "",
//           jobProfiles:
//             data.jobProfiles?.map((profile) => ({
//               course: profile.course || "",
//               designation: profile.designation || "",
//               jobDescription: profile.jobDescription || "",
//               ctc: profile.ctc || "",
//               takeHome: profile.takeHome || "",
//               perks: profile.perks || "",
//               trainingPeriod: profile.trainingPeriod || "",
//               placeOfPosting: profile.placeOfPosting || "",
//             })) || [],
//           eligibleBranches: data.eligibleBranches || {},
//           eligibilityCriteria: data.eligibilityCriteria || "",
//           selectionProcess: {
//             resumeShortlisting:
//               data.selectionProcess?.resumeShortlisting || false,
//             prePlacementTalk: data.selectionProcess?.prePlacementTalk || false,
//             groupDiscussion: data.selectionProcess?.groupDiscussion || false,
//             onlineTest: data.selectionProcess?.onlineTest || false,
//             aptitudeTest: data.selectionProcess?.aptitudeTest || false,
//             technicalTest: data.selectionProcess?.technicalTest || false,
//             technicalInterview:
//               data.selectionProcess?.technicalInterview || false,
//             hrInterview: data.selectionProcess?.hrInterview || false,
//             otherRounds: data.selectionProcess?.otherRounds || "",
//             expectedRecruits: data.selectionProcess?.expectedRecruits || 0,
//             tentativeDate: data.selectionProcess?.tentativeDate || "",
//           },
//           bondDetails: data.bondDetails || "",
//           pointOfContact:
//             data.pointOfContact?.map((contact) => ({
//               name: contact.name || "",
//               designation: contact.designation || "",
//               mobile: contact.mobile || "",
//               email: contact.email || "",
//             })) || [],
//           additionalInfo: {
//             sponsorEvents: data.additionalInfo?.sponsorEvents || "",
//             internshipOffered: data.additionalInfo?.internshipOffered || "",
//             internshipDuration: data.additionalInfo?.internshipDuration || "",
//             contests: data.additionalInfo?.contests || "",
//           },
//           status: data.status || "",
//           submittedBy: data.submittedBy || "",
//           reviewedBy: data.reviewedBy || "",
//           reviewComments: data.reviewComments || "",
//           submissionDate: data.submissionDate || "",
//           reviewDate: data.reviewDate || "",
//           assignedUser:{ 
//             name: data.assignedUser?.name || "",
//             email: data.assignedUser?.email || "",
//             designation: data.assignedUser?.designation || "",
//           },
//           assignedDate: data.assignedDate || "",
//           assignedBy: data.assignedBy || "",
//           driveStatus: data.driveStatus || "",
//         });
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (selectedJNFId) fetchData();
//   }, [selectedJNFId, jnfList]);

//   /**
//    * Adds a new entry to the `jnfDetails` array.
//    * @param {Object} newEntry - The new JNF entry to add.
//    */
//   const addNewEntry = (newEntry) => {
//     try {
//       // Ensure the new entry has a unique ID
//       const newId = jnfList.length
//         ? Math.max(...jnfList.map((jnf) => parseInt(jnf.id, 10))) + 1
//         : 1;

//       const entryWithId = { ...newEntry, id: newId.toString() };

//       // Update the jnfList state with the new entry
//       setJnfList(prevList => [...prevList, entryWithId]);

//       console.log("New entry added:", entryWithId);
//       return true;
//     } catch (err) {
//       console.error("Failed to add new entry:", err.message);
//       return false;
//     }
//   };

//   const getAcceptedJNFs = async () => {
//     // Use the state instead of the imported jnfDetails
//     return jnfList.filter(jnf => jnf.status === 'accepted');
//   };

//   const getJNFById = async (id) => {
//     // Use the state instead of the imported jnfDetails
//     return jnfList.find(jnf => jnf.id === id);
//   };

//   // Add a method to get all JNFs
//   const getAllJNFs = () => {
//     return jnfList;
//   };

//   const getAssignedUserDrives = async () => {
//     // Use the state instead of the imported jnfDetails
//     return jnfList.filter(jnf => (jnf.assignedUser !== null) && (jnf.status === 'accepted'));
//   };

//   return { 
//     formData, 
//     setFormData, 
//     addNewEntry, 
//     loading, 
//     error, 
//     getAcceptedJNFs,
//     getAssignedUserDrives,
//     getJNFById,
//     getAllJNFs,
//     jnfList  // Export the jnfList state
//   };
// }

// // Support both named and default exports
// export { useJNFData };
// export default useJNFData;
import { useState, useEffect } from "react";
import jnfService from "../../services/admin/jnfService";

function useJNFData(selectedJNFId) {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jnfList, setJnfList] = useState([]);

  // Fetch all JNFs when the hook is initialized
  useEffect(() => {
    const fetchAllJNFs = async () => {
      try {
        setLoading(true);
        const response = await jnfService.getAll();
        setJnfList(response || []); // Ensure we set an empty array if response is null
      } catch (err) {
        console.error("Error fetching JNFs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllJNFs();
  }, []);

  // Handle selected JNF
  useEffect(() => {
    const fetchSelectedJNF = async () => {
      if (!selectedJNFId) return;
      
      try {
        setLoading(true);
        const selectedJNF = jnfList.find((jnf) => jnf._id === selectedJNFId);
        
        if (!selectedJNF) {
          throw new Error("JNF not found");
        }
        
        setFormData({
          company: selectedJNF.companyDetails?.name || "",
          email: selectedJNF.companyDetails?.email || "",
          website: selectedJNF.companyDetails?.website || "",
          companyType: selectedJNF.companyDetails?.companyType || "",
          domain: selectedJNF.companyDetails?.domain || "",
          description: selectedJNF.companyDetails?.description || "",
          jobProfiles:
            selectedJNF.jobProfiles?.map((profile) => ({
              course: profile.course || "",
              designation: profile.designation || "",
              jobDescription: profile.jobDescription || "",
              ctc: profile.ctc || "",
              takeHome: profile.takeHome || "",
              perks: profile.perks || "",
              trainingPeriod: profile.trainingPeriod || "",
              placeOfPosting: profile.placeOfPosting || "",
            })) || [],
          eligibleBranches: selectedJNF.eligibleBranches || {},
          eligibilityCriteria: selectedJNF.eligibilityCriteria || "",
          selectionProcess: {
            resumeShortlisting:
              selectedJNF.selectionProcess?.resumeShortlisting || false,
            prePlacementTalk: selectedJNF.selectionProcess?.prePlacementTalk || false,
            groupDiscussion: selectedJNF.selectionProcess?.groupDiscussion || false,
            onlineTest: selectedJNF.selectionProcess?.onlineTest || false,
            aptitudeTest: selectedJNF.selectionProcess?.aptitudeTest || false,
            technicalTest: selectedJNF.selectionProcess?.technicalTest || false,
            technicalInterview:
              selectedJNF.selectionProcess?.technicalInterview || false,
            hrInterview: selectedJNF.selectionProcess?.hrInterview || false,
            otherRounds: selectedJNF.selectionProcess?.otherRounds || "",
            expectedRecruits: selectedJNF.selectionProcess?.expectedRecruits || 0,
            tentativeDate: selectedJNF.selectionProcess?.tentativeDate || "",
          },
          bondDetails: selectedJNF.bondDetails || "",
          pointOfContact:
            selectedJNF.pointOfContact?.map((contact) => ({
              name: contact.name || "",
              designation: contact.designation || "",
              mobile: contact.mobile || "",
              email: contact.email || "",
            })) || [],
          additionalInfo: {
            sponsorEvents: selectedJNF.additionalInfo?.sponsorEvents || "",
            internshipOffered: selectedJNF.additionalInfo?.internshipOffered || "",
            internshipDuration: selectedJNF.additionalInfo?.internshipDuration || "",
            contests: selectedJNF.additionalInfo?.contests || "",
          },
          status: selectedJNF.status || "",
          submittedBy: selectedJNF.submittedBy || "",
          reviewedBy: selectedJNF.reviewedBy || "",
          reviewComments: selectedJNF.reviewComments || "",
          submissionDate: selectedJNF.submissionDate || "",
          reviewDate: selectedJNF.reviewDate || "",
          assignedUser: {
            name: selectedJNF.assignedUser?.name || "",
            email: selectedJNF.assignedUser?.email || "",
            designation: selectedJNF.assignedUser?.designation || "",
          },
          assignedDate: selectedJNF.assignedDate || "",
          assignedBy: selectedJNF.assignedBy || "",
          driveStatus: selectedJNF.driveStatus || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedJNF();
  }, [selectedJNFId, jnfList]);

  const getJNFById = async (id) => {
    try {
      const response = await jnfService.getById(id);
      return response.data;
    } catch (err) {
      console.error("Error fetching JNF by ID:", err);
      throw err;
    }
  };

  const getAllJNFs = async () => {
    try {
      const response = await jnfService.getAll();
      return response || [];
    } catch (err) {
      console.error("Error fetching all JNFs:", err);
      throw err;
    }
  };

  const addNewEntry = async (newEntry) => {
    try {
      const response = await jnfService.create(newEntry);
      setJnfList((prevList) => [...prevList, response]);
      return true;
    } catch (err) {
      console.error("Failed to add new entry:", err.message);
      return false;
    }
  };

  const getAcceptedJNFs = async () => {
    return jnfList.filter((jnf) => jnf.status === 'accepted');
  };

  const getAssignedUserDrives = async () => {
    return jnfList.filter((jnf) => (jnf.assignedUser !== null) && (jnf.status === 'accepted'));
  };

  return {
    formData,
    setFormData,
addNewEntry,
    loading,
addNewEntry,
    error,
    jnfList,
    getJNFById,
    getAllJNFs,
    addNewEntry,
    getAcceptedJNFs,
    getAssignedUserDrives,
  };
}

export { useJNFData };
export default useJNFData;