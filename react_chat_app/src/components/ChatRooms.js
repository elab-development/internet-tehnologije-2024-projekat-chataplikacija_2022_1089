import React from "react";
import { Link } from "react-router-dom";
import "../styles/ChatRooms.css";

// Sadržaj za chat sobe
const ChatRooms = ({rooms}) => {

  return (
    <div className="chat-rooms">
      <h2>Chat Sobe</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            <Link to={`/chat/${room.id}`} className="chat-room">
              {room.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRooms;