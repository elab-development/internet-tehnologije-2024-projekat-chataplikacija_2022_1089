import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Register from './components/Register';
import WelcomePage from './components/WelcomePage';
import GlavnaStr from './components/GlavnaStr';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import GifSelector from './components/GifSelector';


const theme = createTheme();
function App() {
  return (
    <ThemeProvider theme={theme}>
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/glavna" element={<GlavnaStr />} />
        <Route path="/gif" element={<GifSelector />} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
