import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "../styles/ChatRoom.css";


const ChatRoom = () => {
  const { roomId } = useParams(); // Uzimanje ID sobe iz URL-a
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState('user1'); // Postavljen "trenutno ulogivani korisnik-zameniii"
  const [roomName, setRoomName] = useState('');

  // Učitaj prethodne poruke iz localStorage
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem(roomId)) || [];
    setMessages(savedMessages);
    // Učitavanje imena sobe 
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    const room = rooms.find((room) => room.id === parseInt(roomId)); 

    if (room) {
      setRoomName(room.name);
    }else {
        setRoomName('Room not found'); 
      }
  }, [roomId]);

  
  const sendMessage = () => {
    if (message.trim()) {
      // Dodajte novu poruku u niz
      const newMessage = {
        user: currentUser,
        content: message,
        timestamp: new Date().toISOString(),
      };

      const newMessages = [...messages, newMessage];
      setMessages(newMessages);

      // Čuvanje novih poruka u localStorage za odgovarajuću sobu
      localStorage.setItem(roomId, JSON.stringify(newMessages));
      setMessage(''); 
    }
  };

  // prebacivanje između korisnika
  const toggleUser = () => {
    setCurrentUser(currentUser === 'user1' ? 'user2' : 'user1');
  };

  return (
    <div className="chat-room-container">
      <h2>Chat Grupa: {roomName || 'Loading...'}</h2>

      <button className="switch-user-button" onClick={toggleUser}>
        Prebaci na {currentUser === 'user1' ? 'User2' : 'User1'}
      </button>

      <div className="chat-window">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.user === 'user1' ? 'user1-message' : 'user2-message'}
          >
            <strong>{msg.user === 'user1' ? 'User1' : 'User2'}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <input
        className="input-message"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Unesite poruku"
      />
      <button className="send-message-button" onClick={sendMessage}>
        Pošaljite
      </button>
    </div>
  );
  
};

export default ChatRoom;
