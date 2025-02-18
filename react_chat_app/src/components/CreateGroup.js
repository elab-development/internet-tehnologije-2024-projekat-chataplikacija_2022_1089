import React, { useState } from "react";
import "../styles/CreateGroup.css";

const CreateGroup = ({addRoom, deleteRoom, rooms}) => {
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    
    if (!roomName) {
      alert("Ime sobe je obavezno!");
      return;
    }

    // Dodavanje nove sobe u lokalno stanje 
    const newRoom = { id: Date.now(), name: roomName };
    const savedRooms = JSON.parse(localStorage.getItem('rooms')) || [];
    savedRooms.push(newRoom);
    localStorage.setItem('rooms', JSON.stringify(savedRooms));
    addRoom(newRoom);
    setRoomName("");
  };

  const handleDelete = (roomId) => {
    if (window.confirm(`Da li sigurno želiš da obrišeš sobu?`)) {
      // Filtriramo sobe iz localStorage
      const updatedRooms = rooms.filter((room) => room.id !== roomId);
      localStorage.setItem('rooms', JSON.stringify(updatedRooms));
      deleteRoom(roomId); 
    }
  };

  return (
    <div className="create-group">
      <h2>Kreiraj ili obriši sobu</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Ime sobe"
        />
        <button type="submit">Kreiraj sobu</button>
      </form>
      <h3>Postojeće sobe:</h3>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            {room.name}  
            <button onClick={() => handleDelete(room.name)}>Obriši ❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateGroup;