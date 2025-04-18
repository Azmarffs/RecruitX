import React, { useState } from 'react';
import './LoginRegister.css';
import logo from './logo.png';
import { useNavigate } from 'react-router-dom';

const LoginRegister = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'applicant',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const endpoint = isLogin ? '/users/login' : '/users/register';
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        alert(isLogin ? 'Login successful!' : 'Registration successful!');
        console.log('Response:', data);

        // Save token, id, name in localStorage
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.id);
          localStorage.setItem('userName', data.name);
          localStorage.setItem('userRole', data.role);
        }

        // Redirect based on role
        if (data.role === 'applicant') {
          navigate('/dashboard/applicant');
        } else if (data.role === 'recruiter') {
          navigate('/dashboard/recruiter');
        } else if (data.role === 'admin') {
          navigate('/dashboard/admin');
        }
      } else {
        alert(data.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to the server.');
    }
  };

  return (
    <div className="login-register-container">
      <div className="illustration">
        <img src={logo} alt="RecruitX Logo" className="logo" />
        <h1>Welcome to RecruitX</h1>
        <p>Where opportunity meets talent</p>
        <p>"Connecting recruiters and job seekers with precision"</p>
      </div>
      <div className="form-container">
        <div className="tabs">
          <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>
            Login
          </button>
          <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>
            Register
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <label>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </>
          )}
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
          {!isLogin && (
            <>
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleInputChange}>
                <option value="applicant">Applicant</option>
                <option value="recruiter">Recruiter</option>
                <option value="admin">Admin</option>
              </select>
            </>
          )}
          {isLogin && (
            <div className="extras">
              <label>
                <input type="checkbox" /> Remember Me
              </label>
              <a href="#">Forgot Password?</a>
            </div>
          )}
          <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
      </div>
    </div>
  );
};

export default LoginRegister;
