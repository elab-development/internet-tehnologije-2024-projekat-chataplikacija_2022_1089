import "./styles/App.css";
import { Route, Routes, useLocation } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Navbar from "./components/NavBar";
import ChatRooms from "./components/ChatRooms";
import { useState } from "react";
import CreateGroup from "./components/CreateGroup";
import UserCard from "./components/UserCard";
import ChatRoom from "./components/ChatRoom";

function App() {
  const location = useLocation(); 

  const [rooms, setRooms] = useState(() => {
    const savedRooms = localStorage.getItem("rooms");
    return savedRooms ? JSON.parse(savedRooms) : [];
  });
    // dodavanje nove sobe
    const addRoom = (newRoom) => {
      setRooms((prevRooms) => {
        const updatedRooms = [...prevRooms, newRoom];
        localStorage.setItem("rooms", JSON.stringify(updatedRooms));
        return updatedRooms;
      });
    };

    const deleteRoom = (roomName) => {
      setRooms((prevRooms) => {
        const updatedRooms = prevRooms.filter(room => room.name !== roomName);
        localStorage.setItem("rooms", JSON.stringify(updatedRooms));
        return updatedRooms;
      });
    };
    

  
  
  return (
    <div>

      {(location.pathname !== "/login" && location.pathname !== "/register" && location.pathname !== "/") && <Navbar /> }
     
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chatrooms" element={<ChatRooms rooms={rooms} />} />
        <Route path="/create-group" element={<CreateGroup addRoom={addRoom} deleteRoom={deleteRoom} rooms={rooms} />} />
        <Route path="/profile" element={<UserCard />} />
        <Route path="/chat/:roomId" element={<ChatRoom />} />
      </Routes>
    </div>
  );

}

export default App;
