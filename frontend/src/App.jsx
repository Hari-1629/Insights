import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SavedActionItems from './pages/SavedActionItems';
import SubmitFeedback from './pages/SubmitFeedback';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/saved-action-items" element={<SavedActionItems />} />
        <Route path="/submit-feedback" element={<SubmitFeedback />} />
      </Routes>
    </Router>
  );
}

export default App;
