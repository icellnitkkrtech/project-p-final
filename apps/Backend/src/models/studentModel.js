import Student from "../schema/student/studentSchema.js";
import apiResponse from "../utils/apiResponse.js";
import academicResult from "../schema/student/academicResultSchema.js";
export default class StudentModel {
  student = Student;

  async registerStudent(profileData, userId) {
    try {
      // Detailed validation
      if (!profileData) {
        return new apiResponse(400, null, "Profile data is required");
      }

      if (!userId) {
        return new apiResponse(400, null, "User ID is required");
      }
      if (
        !profileData.personalInfo?.name ||
        !profileData.personalInfo?.rollNumber ||
        !profileData.personalInfo?.department ||
        !profileData.personalInfo?.batch
      ) {
        return new apiResponse(
          400,
          null,
          "Missing personal information fields"
        );
      }

      if (
        !profileData.academics?.cgpa ||
        !profileData.academics?.tenthMarks ||
        !profileData.academics?.twelfthMarks
      ) {
        return new apiResponse(
          400,
          null,
          "Missing academic information fields"
        );
      }

      const existingStudent = await this.student.findOne({
        "personalInfo.rollNumber": profileData.personalInfo.rollNumber,
      });

      if (existingStudent) {
        return new apiResponse(409, null, "Roll number already exists");
      }
      const newStudent = await this.student.create({
        user: userId,
        personalInfo: profileData.personalInfo,
        academics: profileData.academics,
      });

      return new apiResponse(201, newStudent, "Student Created Succesfully");
    } catch (error) {
      return new apiResponse(
        500,
        null,
        "An error occurred while creating student"
      );
    }
  }

  // async updateProfile(id, studentData) {
  //   try {
  //     // Find student and populate academic results
  //     const student = await this.student
  //       .findById(id)
  //       .populate("academicResults");
  //     if (!student) {
  //       return new apiResponse(404, null, "Student not found");
  //     }

  //     // Handle locked fields
  //     if (student.personalInfo?.isLocked && studentData.personalInfo) {
  //       console.log("Skipping locked personal info update");
  //       delete studentData.personalInfo;
  //     }

  //     if (student.academics?.isLocked && studentData.academics) {
  //       console.log("Skipping locked academics update");
  //       delete studentData.academics;
  //     }

  //     try {
  //       // Update personal info if not locked
  //       if (!student.personalInfo.isLocked && studentData.personalInfo) {
  //         Object.assign(student.personalInfo, studentData.personalInfo);
  //       }

  //       // Update academics if not locked
  //       if (!student.academics.isLocked && studentData.academics) {
  //         Object.assign(student.academics, studentData.academics);
  //       }

  //       // Handle academic results
  //       if (studentData.academicResults?.semesters) {
  //         let academicResults = student.academicResults;

  //         // Create new academic results if not exists
  //         if (!academicResults) {
  //           academicResults = new this.academicResult({
  //             student: student._id,
  //             semesters: [],
  //             isLocked: false,
  //           });
  //         }

  //         // Ensure semesters array exists
  //         academicResults.semesters = academicResults.semesters || [];

  //         // Update semesters if not locked
  //         if (!academicResults.isLocked) {
  //           studentData.academicResults.semesters.forEach((newSemester) => {
  //             const existingSemesterIndex = academicResults.semesters.findIndex(
  //               (sem) => sem.semester === newSemester.semester
  //             );

  //             if (existingSemesterIndex !== -1) {
  //               // Update existing semester if not locked
  //               const existingSemester =
  //                 academicResults.semesters[existingSemesterIndex];
  //               if (!existingSemester.isLocked) {
  //                 academicResults.semesters[existingSemesterIndex] = {
  //                   ...existingSemester,
  //                   ...newSemester,
  //                 };
  //               }
  //             } else {
  //               // Add new semester
  //               academicResults.semesters.push({
  //                 ...newSemester,
  //                 isLocked: false,
  //               });
  //             }
  //           });

  //           // Save academic results
  //           await academicResults.save();
  //           student.academicResults = academicResults._id;
  //         }
  //       }

  //       // Update other fields
  //       if (studentData.secondaryEmail)
  //         student.secondaryEmail = studentData.secondaryEmail;
  //       if (studentData.skills) student.skills = studentData.skills;
  //       if (studentData.projects) student.projects = studentData.projects;
  //       if (studentData.experience) student.experience = studentData.experience;
  //       if (studentData.education) student.education = studentData.education;
  //       if (studentData.socialLinks)
  //         student.socialLinks = studentData.socialLinks;

  //       // Save student
  //       const updatedStudent = await student.save();

  //       // Return success response
  //       return new apiResponse(
  //         200,
  //         updatedStudent,
  //         "Profile updated successfully"
  //       );
  //     } catch (saveError) {
  //       if (saveError.statusCode === 403) {
  //         return new apiResponse(403, null, saveError.message);
  //       }
  //       throw saveError;
  //     }
  //   } catch (error) {
  //     console.error("Update error:", error);
  //     return new apiResponse(
  //       500,
  //       null,
  //       "An error occurred while updating student profile"
  //     );
  //   }
  // }
  async updateProfile(id, studentData) {
    try {
      // 1. Find and populate student
      const student = await this.student
        .findById(id)
        .populate("academicResults");
      if (!student) {
        return new apiResponse(404, null, "Student not found");
      }

      // 2. Handle locked fields
      if (student.personalInfo?.isLocked && studentData.personalInfo) {
        console.log("Skipping locked personal info update");
        delete studentData.personalInfo;
      }

      if (student.academics?.isLocked && studentData.academics) {
        console.log("Skipping locked academics update");
        delete studentData.academics;
      }

      try {
        // 3. Update personal info if not locked
        if (!student.personalInfo.isLocked && studentData.personalInfo) {
          Object.assign(student.personalInfo, studentData.personalInfo);
        }

        // 4. Update academics if not locked
        if (!student.academics.isLocked && studentData.academics) {
          Object.assign(student.academics, studentData.academics);
        }

        // 5. Handle academic results
        if (studentData.academicResults?.semesters) {
          let academicResults = student.academicResults;

          // Create new academic results if not exists
          if (!academicResults) {
            academicResults = new this.academicResult({
              student: student._id,
              semesters: [],
              isLocked: false,
            });
          }

          // Initialize semesters array
          academicResults.semesters = academicResults.semesters || [];

          // Process semesters if overall results not locked
          if (!academicResults.isLocked) {
            const updatedSemesters = [...academicResults.semesters];

            // Process each semester in update
            for (const newSemester of studentData.academicResults.semesters) {
              const existingSemesterIndex = updatedSemesters.findIndex(
                (sem) => sem.semester === newSemester.semester
              );

              if (existingSemesterIndex !== -1) {
                // Update existing semester if not locked
                const existingSemester =
                  updatedSemesters[existingSemesterIndex];

                if (!existingSemester.isLocked) {
                  updatedSemesters[existingSemesterIndex] = {
                    ...existingSemester,
                    ...newSemester,
                    isLocked: existingSemester.isLocked,
                  };
                } else {
                  console.log(
                    `Skipping locked semester ${existingSemester.semester}`
                  );
                }
              } else {
                // Add new semester
                updatedSemesters.push({
                  ...newSemester,
                  isLocked: false,
                });
              }
            }

            // Handle semester deletions - preserve locked semesters
            const semestersToKeep = updatedSemesters.filter((sem) => {
              const isInUpdate = studentData.academicResults.semesters.some(
                (newSem) => newSem.semester === sem.semester
              );
              return isInUpdate || sem.isLocked;
            });

            // Update final semesters array
            academicResults.semesters = semestersToKeep;

            // Save academic results
            await academicResults.save();
            student.academicResults = academicResults._id;
          } else {
            console.log("Skipping updates - academic results are locked");
          }
        }

        // 6. Update other fields
        if (studentData.secondaryEmail) {
          student.secondaryEmail = studentData.secondaryEmail;
        }
        if (studentData.skills) {
          student.skills = studentData.skills;
        }
        if (studentData.projects) {
          student.projects = studentData.projects;
        }
        if (studentData.experience) {
          student.experience = studentData.experience;
        }
        if (studentData.education) {
          student.education = studentData.education;
        }
        if (studentData.socialLinks) {
          student.socialLinks = studentData.socialLinks;
        }

        // 7. Save and return
        const updatedStudent = await student.save();
        return new apiResponse(
          200,
          updatedStudent,
          "Profile updated successfully"
        );
      } catch (saveError) {
        if (saveError.statusCode === 403) {
          return new apiResponse(403, null, saveError.message);
        }
        throw saveError;
      }
    } catch (error) {
      console.error("Update error:", error);
      return new apiResponse(
        500,
        null,
        error.message || "An error occurred while updating student profile"
      );
    }
  }
  async getProfile(studentId) {
    try {
      const student = await this.student
        .findById(studentId)
        .populate("academicResults");
      if (!student) {
        return new apiResponse(404, null, "Student not found");
      }
      return new apiResponse(200, student, "Student found successfully");
    } catch (error) {
      return new apiResponse(
        500,
        null,
        "An error occurred while fetching student profile"
      );
    }
  }

  async getStudentById(studentId) {
    try {
      const student = await this.student.findById(studentId);
      if (!student) {
        return new apiResponse(404, null, "Student not found");
      }
      return new apiResponse(200, student, "Student found successfully");
    } catch (error) {
      return new apiResponse(
        500,
        null,
        "An error occurred while fetching student profile"
      );
    }
  }

  async getTotalStudents() {
    try {
      const totalStudents = await this.student.countDocuments({});
      return new apiResponse(200, totalStudents, "Total students fetched successfully");
    } catch (error) {
      return new apiResponse(500, null, "An error occurred while fetching total students");
    }
  }

  async getStudents(query) {
    const students = await this.student.find({}); // Fetch all students
    return students;
  }

  async countStudents(query) {
    const {
      search,
      batch,
      branch,
      section,
      status,
      gender,
      placementStatus,
      cgpaRange,
      backlogsRange,
      hasInternship,
      hasProjects,
      hasCertifications,
      activeBacklogs,
      eligibilityStatus,
      offerStatus,
      interviewStatus,
      skillTags,
      location,
      category,
      admissionType,
      feesStatus,
      hostelStatus
    } = query;

    const filter = {};

    // Build your filter based on the query parameters (same as in getStudents)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (batch.length) filter.batch = { $in: batch };
    if (branch.length) filter.branch = { $in: branch };
    if (section.length) filter.section = { $in: section };
    if (status.length) filter.status = { $in: status };
    if (gender.length) filter.gender = { $in: gender };
    if (placementStatus.length) filter.placementStatus = { $in: placementStatus };
    if (cgpaRange) filter.cgpa = { $gte: cgpaRange[0], $lte: cgpaRange[1] };
    if (backlogsRange) filter.activeBacklogs = { $gte: backlogsRange[0], $lte: backlogsRange[1] };
    if (hasInternship !== null) filter.hasInternship = hasInternship;
    if (hasProjects !== null) filter.hasProjects = hasProjects;
    if (hasCertifications !== null) filter.hasCertifications = hasCertifications;
    if (activeBacklogs !== null) filter.activeBacklogs = activeBacklogs;
    if (eligibilityStatus.length) filter.eligibilityStatus = { $in: eligibilityStatus };
    if (offerStatus.length) filter.offerStatus = { $in: offerStatus };
    if (interviewStatus.length) filter.interviewStatus = { $in: interviewStatus };
    if (skillTags.length) filter.skillTags = { $in: skillTags };
    if (location.length) filter.location = { $in: location };
    if (category.length) filter.category = { $in: category };
    if (admissionType.length) filter.admissionType = { $in: admissionType };
    if (feesStatus.length) filter.feesStatus = { $in: feesStatus };
    if (hostelStatus.length) filter.hostelStatus = { $in: hostelStatus };

    const count = await Student.countDocuments(filter);
    return count;
  }
  async findOne(query) {
    return this.student.findOne(query);
  }

  async create(data) {
    return this.student.create(data);
  }

  async deleteStudent(id) {
    try {
      const result = await this.student.findByIdAndDelete(id);
      if (!result) {
        return new apiResponse(404, null, "Student not found");
      }
      return new apiResponse(204, null, "Student deleted successfully");
    } catch (error) {
      return new apiResponse(500, null, "An error occurred while deleting student");
    }
  }
}


