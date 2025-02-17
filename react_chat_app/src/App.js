import "./styles/App.css";
import { Route, Routes, useLocation } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Navbar from "./components/NavBar";
import ChatRooms from "./components/ChatRooms";
import { useState } from "react";

function App() {
  const location = useLocation(); 

  const [rooms, setRooms] = useState(() => {
    const savedRooms = localStorage.getItem("rooms");
    return savedRooms ? JSON.parse(savedRooms) : [
      { id: 1, name: "Grupa1" },
      { id: 2, name: "Chatovanje" },
      { id: 3, name: "Fakultet grupa studenata" },
      { id: 4, name: "Prijatelji <3" }
    ];
  });
  
  
  return (
    <div>
      {(location.pathname !== "/login" && location.pathname !== "/register" && location.pathname !== "/") && <Navbar /> }

      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chatrooms" element={<ChatRooms rooms={rooms} />} />
      </Routes>
    </div>
  );

}

export default App;
