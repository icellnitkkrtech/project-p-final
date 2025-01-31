import React, { useState } from "react";
import { Tabs, Tab, Toolbar, Box, Typography } from "@mui/material";
import { studentQueries, recruiterQueries } from "../../components/admin/query/QueryData";
import QueryTable from "../../components/admin/query/QueryTable";
import QueryDialog from "../../components/admin/query/QueryDialog";
import SearchBar from "../../components/admin/query/SearchBar";


const Query = () => {
  const [activeTab, setActiveTab] = useState("student");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [replyText, setReplyText] = useState("");

  const [studentData, setStudentData] = useState(studentQueries);
  const [recruiterData, setRecruiterData] = useState(recruiterQueries);

  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  const handleViewDetails = (query) => {
    setSelectedQuery(query);
    setReplyText(query.reply || "");
    setOpenDialog(true);
  };

  const handleSendReply = () => {
    const updateQuery = (data, setData) => {
      const updatedData = data.map((q) =>
        q.id === selectedQuery.id ? { ...q, reply: replyText, reviewed: true } : q
      );
      setData(updatedData);
    };

    if (activeTab === "student") {
      updateQuery(studentData, setStudentData);
    } else {
      updateQuery(recruiterData, setRecruiterData);
    }

    setOpenDialog(false);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this query?");
  
    if (confirmDelete) {
      const deleteQuery = (data, setData) => {
        const updatedData = data.filter((q) => q.id !== id);
        setData(updatedData);
      };
  
      if (activeTab === "student") {
        deleteQuery(studentData, setStudentData);
      } else {
        deleteQuery(recruiterData, setRecruiterData);
      }
    }
  };
  

  const filteredQueries = (activeTab === "student" ? studentData : recruiterData).filter(
    (query) =>
      query.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activeTab === "student" ? query.name : query.company)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
        <Box sx={{ justifyContent: "space-between", p: 2 }}>
            <Typography variant="h4" color="primary">Query Management</Typography>
            <Toolbar sx={{ justifyContent: "space-between", p: 2 }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Students" value="student" />
                <Tab label="Recruiters" value="recruiter" />
                </Tabs>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </Toolbar>
        </Box>

      <QueryTable
        queries={filteredQueries} 
        onViewDetails={handleViewDetails} 
        activeTab={activeTab}
        onDelete={handleDelete}/>

      <QueryDialog
        open={openDialog}
        query={selectedQuery}
        replyText={replyText}
        setReplyText={setReplyText}
        onClose={() => setOpenDialog(false)}
        onSendReply={handleSendReply}
        activeTab={activeTab}
      />
    </Box>
  );
};

export default Query;
