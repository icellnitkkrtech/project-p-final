import React, { useState, useEffect } from "react";
import axios from "axios";
import studentService from "../../../../services/admin/studentService";
const ApplicationsSection = ({ studentId }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await studentService.getStudentApplications(studentId  
        );
        setApplications(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [studentId]);

  if (loading) return <div>Loading applications...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b">
        <h3 className="text-xl font-semibold">Job Applications</h3>
      </div>
      <div className="p-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Applied On
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {applications.map((app) => (
              <tr key={app._id}>
                <td className="px-6 py-4">{app.job.company}</td>
                <td className="px-6 py-4">{app.job.title}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      app.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : app.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {new Date(app.appliedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationsSection;
