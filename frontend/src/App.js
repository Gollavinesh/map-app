import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MapView from './components/MapView';
import './styles.css';

// Set axios base URL and interceptors
axios.defaults.baseURL = 'http://localhost:5000';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check existing token validity
    const verifyToken = async () => {
      try {
        await axios.get('/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        localStorage.removeItem('token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    if (token) verifyToken();
    else setLoading(false);
  }, [token]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} />} />
        <Route path="/login" element={
          token ? <Navigate to="/dashboard" /> : <Login setToken={setToken} />
        } />
        <Route path="/dashboard" element={
          token ? <Dashboard /> : <Navigate to="/login" />
        } />
        <Route path="/map/:id" element={
          token ? <MapView /> : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
}

export default App;