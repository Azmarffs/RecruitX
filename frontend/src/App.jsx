import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegister from './assets/LoginRegister';
import ApplicantDashboard from './assets/applicantdashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/dashboard/applicant" element={<ApplicantDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;