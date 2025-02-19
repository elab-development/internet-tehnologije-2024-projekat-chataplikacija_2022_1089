import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/WelcomePage.css";
import backgroundImage from '../jejej.jpg';

const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

const WelcomePage = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (storedUser && storedUser.name) {
      setUserName(storedUser.name);
    } else {
      navigate("/login"); // Ako nema korisnika, preusmeri na login
    }
  }, [navigate]);

  return (
    <div className="welcome-container" style={backgroundStyle}>
      <div className="welcome-card">
        <h1>Dobrodošao/La, {userName}!</h1>
        <p>Drago nam je što ste ovde. Kliknite ispod da udjete u aplikaciju.</p>
        <button className="enter-button" onClick={() => navigate("/chatrooms")}>
          Uđi u chat sobe
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;