import React, { useEffect, useState } from 'react';
import './viewApplicants.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdSync, MdVisibility } from 'react-icons/md';

function ViewApplicants() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const statusOptions = [
    { label: 'Pending', action: 'pending' },
    { label: 'Accepted', action: 'accept' },
    { label: 'Rejected', action: 'reject' },
  ];

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/recruitment/${id}/applicants`, {
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch applicants');

        const data = await response.json();

        if (Array.isArray(data.applications)) {
          const enriched = data.applications.map(app => {
            const statusLower = app.status?.toLowerCase();
            const found = statusOptions.find(s => s.action === statusLower);
            return {
              ...app,
              status: found ? found.label : (app.status ? app.status : 'Pending'),
            };
          });
          setApplications(enriched);
        } else {
          setApplications([]);
        }
      } catch (err) {
        setError('Failed to fetch applicants.');
      }
    };

    fetchApplicants();
  }, [id]);

  const toggleDropdown = (applicationId) => {
    setDropdownOpenId(dropdownOpenId === applicationId ? null : applicationId);
  };

  const handleStatusSelect = async (applicationId, newAction) => {
    try {
      const response = await fetch(`http://localhost:3000/api/recruitment/application/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ action: newAction }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Could not update status: ${text}`);
      }

      const data = await response.json();

      const statusLabel = statusOptions.find(s => s.action === newAction)?.label || newAction;

      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status: statusLabel } : app))
      );

      setDropdownOpenId(null);
      toast.success(data.message || 'Status updated successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to update status.');
    }
  };

  const handleViewApplication = (applicationId, userId) => {
    navigate(`/admindashboard/managerecruitments/${id}/applicant/${userId}`);
  };

  if (error) {
    return (
      <div className="view-applicants">
        <h1 className="heading">
          View <span className="highlight">Applicants</span>
        </h1>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="view-applicants">
      <h1 className="heading">
        View <span className="highlight">Applicants</span>
      </h1>

      <div className="table-wrapper">
        <table className="applicants-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Applied At</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                  No applicants found.
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id}>
                  <td>{app.user.username}</td>
                  <td>{app.user.email}</td>
                  <td>{app.user.phone || 'N/A'}</td>
                  <td>{app.user.location || 'N/A'}</td>
                  <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td>
                    <div className="status-container" style={{ position: 'relative' }}>
                      <div className={`status-label ${app.status.toLowerCase()}`}>
                        {app.status}
                      </div>
                      {app.status === 'Pending' && (
                        <div className="sync-btn">
                          <button
                            className="status-btn"
                            onClick={() => toggleDropdown(app.id)}
                            aria-haspopup="true"
                            aria-expanded={dropdownOpenId === app.id}
                          >
                            <MdSync size={20} />
                          </button>
                        </div>
                      )}
                      {dropdownOpenId === app.id && (
                        <ul className="status-dropdown">
                          {statusOptions.map(({ label, action }) => (
                            <li
                              key={action}
                              className={`dropdown-item ${app.status === label ? 'selected' : ''}`}
                              onClick={() => handleStatusSelect(app.id, action)}
                            >
                              {label}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn view-btn"
                      onClick={() => handleViewApplication(app.id, app.user.id)}
                      aria-label="View application"
                    >
                      <MdVisibility size={22} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-center" />
    </div>
  );
}

export default ViewApplicants;
