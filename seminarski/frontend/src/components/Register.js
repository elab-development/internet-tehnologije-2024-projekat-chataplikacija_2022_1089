import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';
import backgroundImage from '../welcomee.jpg';
import axios from "axios";



const Register = () => {
  const [userData, setUserData] = useState({
    username: "",
    email:"",
    password:"",
    conformPass:""
  });
  
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const WelcomeStyle = {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',  
    };

    function handleInput(e) {
      setUserData({
        ...userData,
        [e.target.name]: e.target.value,
      });
    }
    

    const handleRegister = async (e) => {
      e.preventDefault();

      try {

        const response = await axios.post('api/register', {
            username: userData.username,
            email: userData.email,
            password: userData.password,
            password_confirmation: userData.conformPass 
        });

        console.log('Registracija uspešna:', response.data);
        navigate("/chat_interface");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.log('Validation Errors:', error.response.data.errors);
        setErrors(error.response.data.errors);
    } else {
        console.error('Greška:', error);
        setErrors({ 
            general: error.response?.data?.message || 'Došlo je do greške' 
        });
    }
    }
    };
    
  
  return (
    <div className="welcome-container" style={WelcomeStyle}>
      <div className="register-container">
       
        <div className="register-form">
        
          <h1>Registrujte se</h1>
          {errors.general && <p className="error-message">{errors.general}</p>}
          
          <form onSubmit={handleRegister}>
            <div className="input-group-register">
              
              <input 
                type="text" 
                name="username" 
                placeholder="Korsiničko ime..." 
                value={userData.username} 
                required 
                onInput={handleInput}
              />
              {errors.username && (
                <p className="error-message">{errors.username[0]}</p>
              )}
              <input 
                type="email" 
                name="email" 
                placeholder="Email..." 
                value={userData.email} 
                required 
                onInput={handleInput}
              />
              {errors.email && (
                <p className="error-message">{errors.email[0]}</p>
              )}
              <input 
                type="password" 
                name="password" 
                placeholder="Lozinka.." 
                value={userData.password} 
                required 
                onInput={handleInput}
              />
              {errors.password && (
                <p className="error-message">{errors.password[0]}</p>
              )}
              <input 
                type="password" 
                name="conformPass" 
                placeholder="Potvrda lozinke.." 
                value={userData.conformPass}  
                required 
                onInput={handleInput}
              />
            </div>
            
            <button type="submit" className="register-button">Registruj se</button>
          </form>
          
          <div className="account-options-register">
            <button className="back_to_login" onClick={() => navigate("/")}>Već imate nalog?</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;