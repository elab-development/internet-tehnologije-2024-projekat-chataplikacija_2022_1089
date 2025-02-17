import React, { useState } from "react";
import "../styles/CreateGroup.css";

const CreateGroup = ({addRoom, deleteRoom, rooms}) => {
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Proveri da li je ime sobe prazno
    if (!roomName) {
      alert("Ime sobe je obavezno!");
      return;
    }

    // Dodavanje nove sobe u lokalno stanje 
    const newRoom = { id: Date.now(), name: roomName };
    addRoom(newRoom);
    setRoomName("");
  };

  const handleDelete = (roomName) => {
    if (window.confirm(`Da li sigurno želiš da obrišeš sobu "${roomName}"?`)) {
      deleteRoom(roomName);
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
            <button onClick={() => handleDelete(room.name)}>Obriši❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateGroup;