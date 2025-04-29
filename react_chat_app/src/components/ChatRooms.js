import React from "react";
import { Link } from "react-router-dom";
import "../styles/ChatRooms.css";

// Sadržaj za chat sobe
const ChatRooms = ({rooms}) => {
  
  return (
    <div className="chat-rooms" >
      <p>Izaberite chat grupu i priključite se ćaskanju😉🤗</p>
      <h2>Chat grupe</h2>
      <div className="chat-content">
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            <Link to={`/chatrooms/${room.id}`} className="chat-room">
              {room.name}💬
            </Link>
          </li>
        ))}
      </ul>
      
        
    
    </div>
    </div>
  );
};

export default ChatRooms;