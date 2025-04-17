import { useState } from "react";
import {
  Paper,
  Box,
  Button,
  Alert,
  Snackbar,
  Typography,
  Fade,
  Grow,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "../../../axios";
import PersonalInfoEdit from "./PersonalInfoEdit";
import SkillsEdit from "./SkillsEdit";
import ProjectsEdit from "./ProjectsEdit";
import ExperienceEdit from "./ExperienceEdit";
import EducationEdit from "./EducationEdit";
import AcademicsEdit from "./AcademicsEdit";
import SecondaryEmailEdit from "./SecondaryEmailEdit";
import SocialLinksEdit from "./SocialLinks";

// import { useEffect } from "react";
import { Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { student, setStudent } = useOutletContext();
  const [formData, setFormData] = useState({
    personalInfo: student?.personalInfo || {},
    academics: student?.academics || {
      cgpa: "",
      tenthMarks: "",
      twelfthMarks: "",
    },
    // Fix academicResults initialization
    academicResults: student?.academicResults || {
      semesters: [],
      isLocked: false,
    },
    skills: student?.skills || [],
    projects: student?.projects || [],
    experience: student?.experience || [],
    education: student?.education || [],
    secondaryEmail: student?.secondaryEmail || [],
    socialLinks: student?.socialLinks || {
      github: "",
      linkedIn: "",
    },
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.put(
        `/student/profile/${student._id}`,
        formData
      );

      if (response.data.statusCode === 200) {
        setSuccess(true);
        setStudent(response.data.data);
        setTimeout(() => {
          navigate(`/student/profile`);
        }, 1500);
      }
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    navigate(-1);
  };
  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <Fade in>
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{ mb: 2, borderRadius: 2 }}
          >
            {error}
          </Alert>
        </Fade>
      )}

      <Snackbar
        open={success}
        autoHideDuration={3000}
        message="Profile updated successfully"
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header Card */}
        <Fade in timeout={800}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              background: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
              mb: 3,
            }}
          >
            <Box className="flex justify-between items-center">
              <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
                Edit Profile
              </Typography>
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  disabled={loading}
                  sx={{
                    mr: 2,
                    color: "white",
                    borderColor: "white",
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.8)",
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  startIcon={<SaveIcon />}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                  }}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Fade>

        <motion.div className="space-y-6" variants={itemVariants}>
          <Grow in timeout={800}>
            <div>
              <PersonalInfoEdit
                data={formData.personalInfo}
                isLocked={student?.personalInfo?.isLocked}
                onChange={(personalInfo) =>
                  setFormData((prev) => ({
                    ...prev,
                    personalInfo,
                  }))
                }
              />
            </div>
          </Grow>

          <Grow in timeout={1000}>
            <div>
              <AcademicsEdit
                data={formData.academics}
                isLocked={student?.academics?.isLocked}
                onChange={(academics) =>
                  setFormData((prev) => ({
                    ...prev,
                    academics,
                  }))
                }
              />
            </div>
          </Grow>

          <Grow in timeout={1000}>
            <div>
              <SecondaryEmailEdit
                secondaryEmail={formData.secondaryEmail}
                onChange={(secondaryEmail) =>
                  setFormData((prev) => ({
                    ...prev,
                    secondaryEmail,
                  }))
                }
              />
            </div>
          </Grow>

          <Grow in timeout={1200}>
            <div>
              <SkillsEdit
                skills={formData.skills}
                onSkillsChange={(skills) =>
                  setFormData((prev) => ({
                    ...prev,
                    skills,
                  }))
                }
              />
            </div>
          </Grow>

          <motion.div variants={itemVariants}>
            <ProjectsEdit
              projects={formData.projects}
              onProjectsChange={(projects) =>
                setFormData((prev) => ({
                  ...prev,
                  projects,
                }))
              }
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <ExperienceEdit
              experience={formData.experience}
              onExperienceChange={(experience) =>
                setFormData((prev) => ({
                  ...prev,
                  experience,
                }))
              }
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <EducationEdit
              education={formData.education}
              onEducationChange={(education) =>
                setFormData((prev) => ({
                  ...prev,
                  education,
                }))
              }
            />
          </motion.div>
          <Grow in timeout={1000}>
            <div>
              <SocialLinksEdit
                socialLinks={formData.socialLinks}
                onChange={(socialLinks) =>
                  setFormData((prev) => ({
                    ...prev,
                    socialLinks,
                  }))
                }
              />
            </div>
          </Grow>
        </motion.div>
      </motion.div>
    </form>
  );
};

export default ProfileEdit;
