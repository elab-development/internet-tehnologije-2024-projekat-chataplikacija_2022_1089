import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/WelcomePage.css';
import backgroundImage from '../welcomee.jpg';
import axios from "axios";


const WelcomePage = () => {

  const [showGuestModal, setShowGuestModal] = useState(false);
  const [errors, setErrors] = useState({});

  const [loginData, setLoginData] = useState({
      email:"",
      password:"",
    });

  const WelcomeStyle = {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',  
    };
  function handleInput(e) {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  }

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // Slanje zahteva 
      const response = await axios.post('api/login', {
        email: loginData.email,
        password: loginData.password
      });

      
      localStorage.setItem('token_ulogovanog', response.data.token);
      localStorage.setItem('ulogovani_user', JSON.stringify(response.data.user));// Čuvanje tokena i korisničkih podataka u lokalnom skladištu

      // Postavljanje default-nog Authorization hedera za buduće zahteve
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      console.log("uspesno je ulogovan", response.data
      )
      
      navigate('/glavna');
    } catch (error) {
      
      if (error.response) {
        setErrors({
          general: error.response.data.error || 'Došlo je do greške'});
      }
       else {
        setErrors({
          general: 'Greška u povezivanju'});
      }
    }
  };

  const handleGuestLogin = async (e) => {
    e.preventDefault();
  
    try {
      // Šalje zahtev za guest login bez unosa username-a
      const response = await axios.post('api/guest-login');
  
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
  
      // Postavljanje default Authorization hedera
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
  
      setShowGuestModal(false);
      navigate('/chat_interface');
    } catch (error) {
      console.error('Guest login error:', error);
      setErrors({
        general: 'Greška prilikom guest login-a'
      });
    }
  };

  return (
    <div className="welcome-container" style={WelcomeStyle}>
      
      
      <div className="login-container">
        
        <div className="login-form">
        
          <h1>Ulogujte se</h1>
          
          <form onSubmit={handleLogin}>
            <div className="input-group">
              
              <input 
                type="email" 
                name="email"
                placeholder="Email..." 
                value={loginData.email} 
                required 
                onInput={handleInput}
              />

              <input 
                type="password" 
                name="password"
                placeholder="Lozinka.." 
                value={loginData.password} 
                required 
                onInput={handleInput}
              />
              {errors.general && <p className="error-message">{errors.general}</p>}
            </div>

            <div className="forgot-password">
              <a href="link.com">Zaboravljena lozinka?</a>
            </div>
            
            <button type="submit" className="login-button">Login</button>
          </form>
          
          <div className="account-options">
            <button className="create-account" onClick={() => navigate("/register")}>Napravite nalog</button>
            <button 
              className="guest-button" 
              onClick={() => setShowGuestModal(true)}
            >
              Nastavi kao gost
            </button>
          </div>
        </div>
      </div>
      
      {showGuestModal && (
        <div className="modal-overlay">
          <div className="guest-modal">
            <h2>Nastavak kao gost</h2>
            <p> Ps. ulaskom kao gost imate pristup samo javnim chat grupama</p>
            <div className="modal-buttons">
                <button type="button" onClick={() => setShowGuestModal(false)}>Otkaži</button>
                <button onClick={handleGuestLogin}>Nastavi kao gost</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomePage;