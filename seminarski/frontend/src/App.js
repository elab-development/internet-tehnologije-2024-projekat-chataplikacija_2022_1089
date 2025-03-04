import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ChatInterface from './components/ChatInterface';
import Register from './components/Register';
import WelcomePage from './components/WelcomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/chat_interface" element={<ChatInterface />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
