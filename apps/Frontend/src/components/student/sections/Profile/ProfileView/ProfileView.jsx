import React from "react";
import {
  Paper,
  Typography,
  Grid,
  Button,
  Box,
  Chip,
  Card,
  CardContent,
  IconButton,
  Link,
  Fade,
  Grow,
  Tooltip,
} from "@mui/material";
import {
  School,
  Work,
  Code,
  Assignment,
  Edit as EditIcon,
  GitHub,
  LinkedIn,
  Block,
  Email,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Edit } from "@mui/icons-material";
const ProfileView = ({ student, onEdit }) => {
  const navigate = useNavigate();
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

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Card */}
      <Fade in timeout={800}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            background: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
          }}
        >
          <Box className="flex justify-between items-start">
            <Box className="text-white">
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {student?.personalInfo?.name}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {student?.personalInfo?.course} •{" "}
                {student?.personalInfo?.department} •{" "}
                {student?.personalInfo?.batch}
              </Typography>
              <Box className="flex gap-3 mt-3">
                {student?.socialLinks?.github && (
                  <Tooltip title="GitHub Profile">
                    <IconButton
                      size="small"
                      sx={{
                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                      }}
                      href={student.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GitHub />
                    </IconButton>
                  </Tooltip>
                )}
                {student?.socialLinks?.linkedIn && (
                  <Tooltip title="LinkedIn Profile">
                    <IconButton
                      size="small"
                      sx={{
                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                      }}
                      href={student.socialLinks.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkedIn />
                    </IconButton>
                  </Tooltip>
                )}
                {student?.secondaryEmail && (
                  <Tooltip title="Send Email">
                    <IconButton
                      size="small"
                      sx={{
                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                      }}
                      href={`mailto:${student.secondaryEmail}`}
                    >
                      <Email />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => navigate(`/student/profile/edit`)}
            >
              Edit Profile
            </Button>
          </Box>
        </Paper>
      </Fade>
      {/* debour section*/}

      {student?.isDeboured && (
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: "#ffebee", // Light red background
              border: "1px solid #ef5350",
              borderRadius: 2,
            }}
          >
            <Box className="flex items-start gap-3">
              <Box
                sx={{
                  bgcolor: "#ef5350",
                  p: 1,
                  borderRadius: "50%",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Block fontSize="small" />
              </Box>
              <Box>
                <Typography
                  variant="subtitle1"
                  color="error"
                  sx={{ fontWeight: 600, mb: 0.5 }}
                >
                  Account Deboured
                </Typography>
                <Typography variant="body2" color="error.dark">
                  {student?.debourDetails?.reason || "No reason provided"}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", mt: 1, color: "text.secondary" }}
                >
                  Deboured on:{" "}
                  {new Date(
                    student?.debourDetails?.debouredAt
                  ).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Fade>
      )}
      <Grid container spacing={3}>
        {/* Academic Info */}
        <Grid item xs={12} md={6}>
          <Grow in timeout={1000}>
            <Card
              className="h-full"
              sx={{
                background: "linear-gradient(135deg, #fff 0%, #f5f5f5 100%)",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  className="flex items-center gap-2 mb-4"
                  color="primary"
                >
                  <School /> Academic Information
                </Typography>
                <Box className="space-y-4">
                  <Box className="p-3 bg-blue-50 rounded-lg">
                    <Typography variant="subtitle2" color="primary">
                      CGPA
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {student?.academics?.cgpa}
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box className="p-3 bg-green-50 rounded-lg">
                        <Typography variant="subtitle2" color="success.main">
                          Class X
                        </Typography>
                        <Typography variant="h5">
                          {student?.academics?.tenthMarks}%
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box className="p-3 bg-purple-50 rounded-lg">
                        <Typography variant="subtitle2" color="secondary.main">
                          Class XII
                        </Typography>
                        <Typography variant="h5">
                          {student?.academics?.twelfthMarks}%
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        {/* Skills */}
        <Grid item xs={12} md={6}>
          <Grow in timeout={1200}>
            <Card
              className="h-full"
              sx={{
                background: "linear-gradient(135deg, #fff 0%, #f5f5f5 100%)",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  className="flex items-center gap-2 mb-4"
                  color="primary"
                >
                  <Code /> Skills
                </Typography>
                <Box className="flex flex-wrap gap-2">
                  {student?.skills?.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      sx={{
                        bgcolor: "#3498db",
                        color: "white",
                        "&:hover": { bgcolor: "#2980b9" },
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grow>
        </Grid>
      </Grid>
      {/* Projects Section */}
      <motion.div variants={itemVariants}>
        <Card
          sx={{
            mt: 3,
            background: "linear-gradient(135deg, #fff 0%, #f5f5f5 100%)",
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              className="flex items-center gap-2 mb-4"
              color="primary"
            >
              <Assignment /> Projects
            </Typography>
            <Box className="space-y-4">
              {student?.projects?.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" color="primary">
                      {project.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ my: 1, color: "text.secondary" }}
                    >
                      {project.description}
                    </Typography>
                    <Box className="flex flex-wrap gap-2">
                      {project.technologies?.map((tech, i) => (
                        <Chip
                          key={i}
                          label={tech}
                          size="small"
                          sx={{ bgcolor: "#ecf0f1", color: "#2c3e50" }}
                        />
                      ))}
                    </Box>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </CardContent>
        </Card>
        {/* Experience Section */}
        <motion.div variants={itemVariants}>
          <Card
            sx={{
              mt: 3,
              background: "linear-gradient(135deg, #fff 0%, #f5f5f5 100%)",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                className="flex items-center gap-2 mb-4"
                color="primary"
              >
                <Work /> Experience
              </Typography>
              <Box className="space-y-4">
                {student?.experience?.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      <Typography variant="h6" color="primary">
                        {exp.title}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "text.secondary", mb: 1 }}
                      >
                        {exp.company} • {exp.duration}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {exp.description}
                      </Typography>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Education Section */}
        <motion.div variants={itemVariants}>
          <Card
            sx={{
              mt: 3,
              background: "linear-gradient(135deg, #fff 0%, #f5f5f5 100%)",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                className="flex items-center gap-2 mb-4"
                color="primary"
              >
                <School /> Education
              </Typography>
              <Box className="space-y-4">
                {student?.education?.map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      <Typography variant="h6" color="primary">
                        {edu.degree}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "text.secondary", mb: 1 }}
                      >
                        {edu.institution} • {edu.year}
                      </Typography>
                      <Box
                        sx={{
                          mt: 2,
                          p: 1,
                          bgcolor: "rgba(52, 152, 219, 0.1)",
                          borderRadius: 1,
                          display: "inline-block",
                        }}
                      >
                        <Typography variant="subtitle2" color="primary">
                          Score: {edu.score}
                        </Typography>
                      </Box>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileView;
