import { useState, useEffect } from "react";
import jnfDetails from "../../components/admin/jnfManagement/jnfDetails";

function useJNFData(selectedJNFId) {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Add state to manage JNF list
  const [jnfList, setJnfList] = useState(jnfDetails);

  useEffect(() => {
    const fetchData = () => {
      try {
        setLoading(true);
        const data = jnfList.find((jnf) => jnf.id === selectedJNFId);
        if (!data) {
          throw new Error("JNF not found");
        }
        setFormData({
          company: data.name || "",
          email: data.email || "",
          website: data.website || "",
          companyType: data.companyType || "",
          domain: data.domain || "",
          description: data.description || "",
          jobProfiles:
            data.jobProfiles?.map((profile) => ({
              course: profile.course || "",
              designation: profile.designation || "",
              jobDescription: profile.jobDescription || "",
              ctc: profile.ctc || "",
              takeHome: profile.takeHome || "",
              perks: profile.perks || "",
              trainingPeriod: profile.trainingPeriod || "",
              placeOfPosting: profile.placeOfPosting || "",
            })) || [],
          eligibleBranches: data.eligibleBranches || {},
          eligibilityCriteria: data.eligibilityCriteria || "",
          selectionProcess: {
            resumeShortlisting:
              data.selectionProcess?.resumeShortlisting || false,
            prePlacementTalk: data.selectionProcess?.prePlacementTalk || false,
            groupDiscussion: data.selectionProcess?.groupDiscussion || false,
            onlineTest: data.selectionProcess?.onlineTest || false,
            aptitudeTest: data.selectionProcess?.aptitudeTest || false,
            technicalTest: data.selectionProcess?.technicalTest || false,
            technicalInterview:
              data.selectionProcess?.technicalInterview || false,
            hrInterview: data.selectionProcess?.hrInterview || false,
            otherRounds: data.selectionProcess?.otherRounds || "",
            expectedRecruits: data.selectionProcess?.expectedRecruits || 0,
            tentativeDate: data.selectionProcess?.tentativeDate || "",
          },
          bondDetails: data.bondDetails || "",
          pointOfContact:
            data.pointOfContact?.map((contact) => ({
              name: contact.name || "",
              designation: contact.designation || "",
              mobile: contact.mobile || "",
              email: contact.email || "",
            })) || [],
          additionalInfo: {
            sponsorEvents: data.additionalInfo?.sponsorEvents || "",
            internshipOffered: data.additionalInfo?.internshipOffered || "",
            internshipDuration: data.additionalInfo?.internshipDuration || "",
            contests: data.additionalInfo?.contests || "",
          },
          status: data.status || "",
          submittedBy: data.submittedBy || "",
          reviewedBy: data.reviewedBy || "",
          reviewComments: data.reviewComments || "",
          submissionDate: data.submissionDate || "",
          reviewDate: data.reviewDate || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedJNFId) fetchData();
  }, [selectedJNFId, jnfList]);

  /**
   * Adds a new entry to the `jnfDetails` array.
   * @param {Object} newEntry - The new JNF entry to add.
   */
  const addNewEntry = (newEntry) => {
    try {
      // Ensure the new entry has a unique ID
      const newId = jnfList.length
        ? Math.max(...jnfList.map((jnf) => parseInt(jnf.id, 10))) + 1
        : 1;

      const entryWithId = { ...newEntry, id: newId.toString() };

      // Update the jnfList state with the new entry
      setJnfList(prevList => [...prevList, entryWithId]);

      console.log("New entry added:", entryWithId);
      return true;
    } catch (err) {
      console.error("Failed to add new entry:", err.message);
      return false;
    }
  };

  const getAcceptedJNFs = async () => {
    // Use the state instead of the imported jnfDetails
    return jnfList.filter(jnf => jnf.status === 'accepted');
  };

  const getJNFById = async (id) => {
    // Use the state instead of the imported jnfDetails
    return jnfList.find(jnf => jnf.id === id);
  };

  // Add a method to get all JNFs
  const getAllJNFs = () => {
    return jnfList;
  };

  return { 
    formData, 
    setFormData, 
    addNewEntry, 
    loading, 
    error, 
    getAcceptedJNFs, 
    getJNFById,
    getAllJNFs,
    jnfList  // Export the jnfList state
  };
}

// Support both named and default exports
export { useJNFData };
export default useJNFData;
