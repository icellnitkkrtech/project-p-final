import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import ProfileView from "./ProfileView/ProfileView";
import ProfileEdit from "./ProfileEdit/ProfileEdit";
import axios from "axios";
import { useState } from "react";
const ProfileSection = () => {
  const navigate = useNavigate();
  const { student, setStudent } = useOutletContext();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    navigate("edit");
  };

  const handleUpdate = async (updatedData) => {
    try {
      const response = await axios.put(
        `/student/profile/${student._id}`,
        updatedData
      );
      if (response.data.statusCode === 200) {
        setStudent(response.data.data);
        setIsEditing(false);
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Update failed");
    }
  };

  return isEditing ? (
    <ProfileEdit
      student={student}
      onUpdate={handleUpdate}
      onCancel={() => setIsEditing(false)}
    />
  ) : (
    <ProfileView student={student} onEdit={handleEdit} />
  );
};

export default ProfileSection;
