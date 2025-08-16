import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/WelcomePage.css';
import backgroundImage from '../welcomee.jpg';
import axios from "axios";
import Person4Icon from '@mui/icons-material/Person4';

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

      await new Promise(resolve => setTimeout(resolve, 200));
      // Slanje zahteva 
      const response = await axios.post('api/login', {
        email: loginData.email,
        password: loginData.password
      },{
        withCredentials: true
      }
    );

      sessionStorage.setItem('ulogovani_user', JSON.stringify(response.data.user));
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

      await new Promise(resolve => setTimeout(resolve, 200));

      const response = await axios.post('api/guest-login',{},{
        withCredentials: true //za cookies
      });

      sessionStorage.setItem('ulogovani_user', JSON.stringify(response.data.user));
      await new Promise(resolve => setTimeout(resolve, 300));
  
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
    
    if (adminCredentials.email === 'Admin' && adminCredentials.password === 'admin') {
      const adminUser = {
        id: 'admin',
        name: 'Admin',
        email: 'admin@app.com',
        role: 'admin'
      };
      
      sessionStorage.setItem('ulogovani_user', JSON.stringify(adminUser));
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

  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [passwordResetData, setPasswordResetData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordResetErrors, setPasswordResetErrors] = useState({});

  
  const handlePasswordResetChange = (e) => {
    const { name, value } = e.target;
    setPasswordResetData(prev => ({
      ...prev,
      [name]: value
    }));
    
    
    if (passwordResetErrors[name]) {
      setPasswordResetErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    setPasswordResetErrors({});

    
    const errors = {};
    
    if (!passwordResetData.email) {
      errors.email = 'Email je obavezan';
    } else if (!/\S+@\S+\.\S+/.test(passwordResetData.email)) {
      errors.email = 'Email format nije valjan';
    }
    
    if (!passwordResetData.newPassword) {
      errors.newPassword = 'Nova lozinka je obavezna';
    } else if (passwordResetData.newPassword.length < 8) {
      errors.newPassword = 'Lozinka mora imati najmanje 8 karaktera';
    }
    
    if (!passwordResetData.confirmPassword) {
      errors.confirmPassword = 'Potvrda lozinke je obavezna';
    } else if (passwordResetData.newPassword !== passwordResetData.confirmPassword) {
      errors.confirmPassword = 'Lozinke se ne poklapaju';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordResetErrors(errors);
      return;
    }

    try {
      const response = await axios.post('/api/reset-password', {
        email: passwordResetData.email,
        new_password: passwordResetData.newPassword,
        new_password_confirmation: passwordResetData.confirmPassword
      });

      if (response.data.status === 'success') {
        alert('Lozinka je uspešno promenjena!');
        setShowPasswordResetModal(false);
        setPasswordResetData({ email: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setPasswordResetErrors({ general: error.response.data.message });
      } else {
        setPasswordResetErrors({ general: 'Došlo je do greške. Pokušajte ponovo.' });
      }
    }
  };

  // Funkcija za zatvaranje modala
  const handlePasswordResetCancel = () => {
    setShowPasswordResetModal(false);
    setPasswordResetData({ email: '', newPassword: '', confirmPassword: '' });
    setPasswordResetErrors({});
  };


  return (
    <div className="welcome-container" style={WelcomeStyle}>
      
      <button className="admin-button" onClick={handleAdminLogin} title="Admin Login">
      <Person4Icon></Person4Icon>
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
             <button 
                type="button" 
                className="forgot-password-link" 
                onClick={() => setShowPasswordResetModal(true)}
              >
                Zaboravljena lozinka?
              </button>
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

      {showPasswordResetModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ color: 'white' }}>Resetuj lozinku</h2>
            <form onSubmit={handlePasswordResetSubmit}>
              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Unesite vaš email..."
                  value={passwordResetData.email}
                  required
                  onChange={handlePasswordResetChange}
                />
                {passwordResetErrors.email && (
                  <p style={{ color: 'white' }} className="error-message">{passwordResetErrors.email}</p>
                )}
                
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Nova lozinka..."
                  value={passwordResetData.newPassword}
                  required
                  onChange={handlePasswordResetChange}
                />
                {passwordResetErrors.newPassword && (
                  <p style={{ color: 'white' }} className="error-message">{passwordResetErrors.newPassword}</p>
                )}
                
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Potvrdite novu lozinku..."
                  value={passwordResetData.confirmPassword}
                  required
                  onChange={handlePasswordResetChange}
                />
                {passwordResetErrors.confirmPassword && (
                  <p style={{ color: 'white' }} className="error-message">{passwordResetErrors.confirmPassword}</p>
                )}
                
                {passwordResetErrors.general && (
                  <p style={{ color: 'white' }} className="error-message">{passwordResetErrors.general}</p>
                )}
              </div>
              
              <div className="modal-buttons">
                <button type="button" onClick={handlePasswordResetCancel}>
                  Otkaži
                </button>
                <button type="submit">
                  Promeni lozinku
                </button>
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