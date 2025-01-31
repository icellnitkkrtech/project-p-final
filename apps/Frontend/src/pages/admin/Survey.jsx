import React, { useState } from "react";
import SurveyToolbar from "../../components/admin/survey/SurveyToolbar";
import SurveyList from "../../components/admin/survey/SurveyList";
import SurveyDialog from "../../components/admin/survey/SurveyDialog";

const Survey = () => {
  const [allSurveys, setAllSurveys] = useState([
    { title: "Company Feedback Form", status: "Published", type: "Feedback", description: "Feedback form for companies" },
    { title: "Career Options Survey", status: "Published", type: "Career", description: "Survey for career options" },
    { title: "Interested Candidate Survey", status: "Draft", type: "Placement", description: "Survey for interested candidates" },
    { title: "Custom Surveys", status: "Draft", type: "Feedback", description: "Custom surveys" },
  ]);

  const [filteredSurveys, setFilteredSurveys] = useState(allSurveys);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showFormModal, setShowFormModal] = useState(false);
  const [newForm, setNewForm] = useState({ title: "", type: "", description: "", status: "" });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingFormIndex, setEditingFormIndex] = useState(null);

  const isFormValid = () =>
    newForm.title.trim() !== "" && newForm.type.trim() !== "" && newForm.description.trim() !== "";

  const handleDeleteForm = (index) => {
    const updatedSurveys = allSurveys.filter((_, idx) => idx !== index);
    setAllSurveys(updatedSurveys);
    handleFilterChange(updatedSurveys);
  };

  const handleCloneForm = (index) => {
    const formToClone = allSurveys[index];
    const clonedForm = {
      title: `${formToClone.title || ""} (Copy)`,
      type: formToClone.type || "",
      description: formToClone.description || "",
      status: "Draft",
    };
    setNewForm(clonedForm);
    setIsEditMode(false);
    setShowFormModal(true);
  };

  const handleViewForm = (index) => {
    const formToView = allSurveys[index];
    alert(`Viewing form: ${formToView.title}`);
  };

  const handleViewReport = (index) => {
    const formToView = allSurveys[index];
    alert(`Viewing report for: ${formToView.title}`);
  };

  const handleEditForm = (index) => {
    const formToEdit = allSurveys[index];
    setNewForm({ ...formToEdit });
    setEditingFormIndex(index);
    setIsEditMode(true);
    setShowFormModal(true);
  };

  const handleSaveAsDraft = () => {
    if (isEditMode) {
      const updatedSurveys = allSurveys.map((survey, idx) =>
        idx === editingFormIndex ? { ...newForm, status: "Draft" } : survey
      );
      setAllSurveys(updatedSurveys);
      handleFilterChange(updatedSurveys);
    } else {
      const updatedSurveys = [{ ...newForm, status: "Draft" }, ...allSurveys];
      setAllSurveys(updatedSurveys);
      handleFilterChange(updatedSurveys);
    }
    setShowFormModal(false);
  };

  const handlePublish = () => {
    if (isFormValid()) {
      if (isEditMode) {
        const updatedSurveys = allSurveys.map((survey, idx) =>
          idx === editingFormIndex ? { ...newForm, status: "Published" } : survey
        );
        setAllSurveys(updatedSurveys);
        handleFilterChange(updatedSurveys);
      } else {
        const updatedSurveys = [{ ...newForm, status: "Published" }, ...allSurveys];
        setAllSurveys(updatedSurveys);
        handleFilterChange(updatedSurveys);
      }
      setShowFormModal(false);
    }
  };

  const handleCreateNew = () => {
    setNewForm({ title: "", type: "", description: "", status: "" });
    setIsEditMode(false);
    setShowFormModal(true);
  };

  const handleFilterChange = (updatedSurveys = allSurveys) => {
    const filtered = updatedSurveys.filter((survey) => {
      const matchesType = selectedType === "All" || survey.type === selectedType;
      const matchesStatus = selectedStatus === "All" || survey.status === selectedStatus;
      const matchesSearch = searchTerm === "" || survey.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesStatus && matchesSearch;
    });
    setFilteredSurveys(filtered);
  };

  const getSurveyActions = (status, index) => {
    if (status === "Published") {
      return [
        { label: "View Form", action: () => handleViewForm(index) },
        { label: "Delete", action: () => handleDeleteForm(index) },
        { label: "View Report", action: () => handleViewReport(index) },
        { label: "Clone Form", action: () => handleCloneForm(index) },
      ];
    }
    return [
      { label: "Edit Form", action: () => handleEditForm(index) },
      { label: "Delete", action: () => handleDeleteForm(index) },
    ];
  };
  

  return (
    <>
      <SurveyToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        handleFilterChange={handleFilterChange}
        handleCreateNew={handleCreateNew}
      />

      <SurveyList
        surveys={filteredSurveys}
        getSurveyActions={getSurveyActions}
        onDelete={handleDeleteForm}
        onClone={handleCloneForm}
        onView={handleViewForm}
        onViewReport={handleViewReport}
        onEdit={handleEditForm}
      />
      <SurveyDialog
        open={showFormModal}
        newForm={newForm}
        setNewForm={setNewForm}
        isFormValid={isFormValid}
        isEditMode={isEditMode}
        handleSaveAsDraft={handleSaveAsDraft}
        handlePublish={handlePublish}
        handleClose={() => setShowFormModal(false)}
      />
    </>
  );
};

export default Survey;
