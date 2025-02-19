import { useState } from "react";
import "../styles/Login.css";
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem("user"));
  if (userData && userData.email === email) {
    localStorage.setItem("loggedInUser", JSON.stringify(userData)); // Postavljamo aktivnog korisnika
    console.log("Uspešno prijavljen:", userData);
    navigate("/welcomePage");
  } else {
    alert("Neispravan email ili lozinka");
  }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Prijava</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}//svaki put kad korisnik nesto ukuca, azurira se
          required
        />
        <input
          type="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Prijavi se</button>
        <p>
            Nemate nalog? <Link to="/register">Registrujte se ovde</Link>
        </p>
      </form>
      
    </div>
  );
};

export default Login;