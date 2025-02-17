import React from "react";
import { Link } from "react-router-dom";
import "../styles/ChatRooms.css";

// Sadržaj za chat sobe
const ChatRooms = ({rooms}) => {

  return (
    <div className="chat-rooms">
      <h2>Chat Sobe</h2>
      <div className="chat-content">
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            <Link to={`/chat/${room.id}`} className="chat-room">
              {room.name}
            </Link>
          </li>
        ))}
      </ul>
      <div className="images-container">
        <img src="images/group-chat-icon.jpg" alt="Chat" className="right-image" />
    </div>
    </div>
    </div>
  );
};

export default ChatRooms;