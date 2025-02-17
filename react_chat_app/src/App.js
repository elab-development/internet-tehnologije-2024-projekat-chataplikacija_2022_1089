import "./styles/App.css";
import { Route, Routes, useLocation } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Navbar from "./components/NavBar";


function App() {
  const location = useLocation(); 
  return (
    <div>
      {(location.pathname !== "/login" && location.pathname !== "/register" && location.pathname !== "/") && <Navbar /> }

      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );

}

export default App;
