import { useState } from "react";
import "../styles/Register.css";
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../pozad.jpg';

const Register = () => {
  const registerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',  
  };

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Lozinke se ne poklapaju");
      return;
    }
    const userData = { name, email };
  localStorage.setItem("user", JSON.stringify(userData)); // Čuvamo korisnika u local storage

  console.log("Kreiranje naloga:", userData);
  navigate("/login");
  };

  return (
    <div className="register-container" style={registerStyle}>
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Registracija</h2>
        <input
          type="text"
          placeholder="Ime"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Potvrdi lozinku"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Registruj se</button>
        <p>
        Već imate nalog? <Link to="/login">Prijavite se ovde</Link>
        </p>
      </form>
    </div>
    );
};

export default Register;
