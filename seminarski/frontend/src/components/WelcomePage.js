import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/WelcomePage.css';
import backgroundImage from '../welcomee.jpg';
import axios from "axios";


const WelcomePage = () => {

  const [showGuestModal, setShowGuestModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    email: '',
    password: ''
  });

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

      await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
      // Slanje zahteva 
      const response = await axios.post('api/login', {
        email: loginData.email,
        password: loginData.password
      },{
        withCredentials: true
      }
    );

      localStorage.setItem('ulogovani_user', JSON.stringify(response.data.user));
      console.log("uspesno je ulogovan", response.data)
      
      
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

      await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
      
      const response = await axios.post('api/guest-login',{},{
        withCredentials: true //za cookies
      });

      localStorage.setItem('ulogovani_user', JSON.stringify(response.data.user));
  
  
      setShowGuestModal(false);
      console.log("uspesno je usao gost", response.data);
      navigate('/glavna');
    } catch (error) {
      console.error('Guest login error:', error);
      setErrors({
        general: 'Greška prilikom guest login-a'
      });
    }
  };

  const handleAdminLogin = () => {
    setShowAdminModal(true);
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    
    // Proveri admin credentials
    if (adminCredentials.email === 'Admin' && adminCredentials.password === 'admin') {
      const adminUser = {
        id: 'admin',
        name: 'Admin',
        email: 'admin@app.com',
        role: 'admin'
      };
      
      localStorage.setItem('ulogovani_user', JSON.stringify(adminUser));
      setShowAdminModal(false);
      setAdminCredentials({ email: '', password: '' });
      setErrors({});
      
      console.log("Admin je uspešno ulogovan", adminUser);
      navigate('/glavna');
    } else {
      setErrors({ admin: 'Neispravni admin podaci!' });
    }
  };

  const handleAdminInputChange = (e) => {
    setAdminCredentials({
      ...adminCredentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="welcome-container" style={WelcomeStyle}>
      
      <button className="admin-button" onClick={handleAdminLogin} title="Admin Login">
        A
      </button>
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
      {showAdminModal && (
        <div className="modal-overlay">
          <div className="guest-modal">
            <h2>Admin Login</h2>
            <form onSubmit={handleAdminSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  name="email"
                  placeholder="Admin ime..."
                  value={adminCredentials.email}
                  required
                  onChange={handleAdminInputChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Admin šifra..."
                  value={adminCredentials.password}
                  required
                  onChange={handleAdminInputChange}
                />
                {errors.admin && <p className="error-message">{errors.admin}</p>}
              </div>
              <div className="modal-buttons">
                <button type="button" onClick={() => {
                  setShowAdminModal(false);
                  setAdminCredentials({ email: '', password: '' });
                  setErrors({});
                }}>Otkaži</button>
                <button type="submit">Uloguj se</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {showGuestModal && (
        <div className="modal-overlay">
          <div className="guest-modal">
            <h2>Nastavak kao gost</h2>
            <p> Ps. ulaskom kao gost imate pristup samo javnim chat grupama i nemate pristup mnogim funkcionalnostima aplikacije. Preporučujemo registrovanje za bolje performanse.</p>
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