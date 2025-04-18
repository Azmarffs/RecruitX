import React, { useEffect, useState } from 'react';
import './applicantdashboard.css';

const ApplicantDashboard = () => {
  const [resumeCompletion, setResumeCompletion] = useState(0);
  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState({ name: '', id: '' });
  const [loading, setLoading] = useState(true);

  // Decode JWT
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (err) {
      console.error('Invalid token format', err);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found in localStorage');
      return;
    }

    const payload = decodeToken(token);
    if (!payload?.userId || !payload?.email) {
      console.warn('Invalid token payload', payload);
      return;
    }

    const userId = payload.userId;
    const email = payload.email;
    const fallbackName = payload.name || payload.email.split('@')[0];
    setUser({ id: userId, name: fallbackName });

    const fetchData = () => {
      // Recent Applications
      fetch(`http://localhost:5000/applications/applicantId/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setRecentApplications(data))
        .catch(err => {
          console.error("Error fetching recent applications:", err);
        });

      // Upcoming Interviews
      fetch(`http://localhost:5000/interviews/applicantId/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setUpcomingInterviews(data);
          } else {
            setUpcomingInterviews([]); // Set to an empty array on failure
          }
        })
        .catch(err => {
          console.error("Error fetching upcoming interviews:", err);
          setUpcomingInterviews([]); // Make sure you set an empty array on error
        });

      // Notifications
      fetch(`http://localhost:5000/notifications/byemail/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setNotifications(data))
        .catch(err => {
          console.error("Error fetching notifications:", err);
        });

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="applicant-dashboard">
      <h1>Welcome back, {user.name || 'Applicant'}!</h1>

      {/* Recent Applications */}
      <div className="recent-applications">
        <h2>Recent Applications</h2>
        <ul>
          {recentApplications.length === 0 ? (
            <p>No applications found.</p>
          ) : (
            recentApplications.map((application) => (
              <li key={application.id}>
                {application.jobTitle} -{' '}
                <span className={`status ${application.status.toLowerCase()}`}>
                  {application.status}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Upcoming Interviews */}
      <div className="upcoming-interviews">
        <h2>Upcoming Interviews</h2>
        <div className="interview-cards">
          {Array.isArray(upcomingInterviews) && upcomingInterviews.map((interview) => (
            <div className="interview-card" key={interview.id}>
              <h3>{interview.jobTitle}</h3>
              <p>Date: {new Date(interview.date).toLocaleDateString()}</p>
              <p>Time: {new Date(interview.date).toLocaleTimeString()}</p>
              <p>Recruiter: {interview.recruiterName}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="notifications">
        <h2>Notifications</h2>
        <ul>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <li key={index}>{notification.text}</li>
            ))
          ) : (
            <p>No new notifications.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ApplicantDashboard;
