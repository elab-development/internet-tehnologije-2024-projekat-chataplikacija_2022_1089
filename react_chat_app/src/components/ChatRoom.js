import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "../styles/ChatRoom.css";
import backgroundImage from '../pozadinaa.jpg';
import useEmojis from './useEmojis';
import usePagination from './usePagination';



const ChatRoom = () => {
  const { roomId } = useParams(); // Uzimanje ID sobe iz URL-a
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); 
  const [roomName, setRoomName] = useState('');
  const [users, setUsers] = useState([]); 
  const [newUserName, setNewUserName] = useState(""); 
  const [activeUser, setActiveUser] = useState(null);
  const [showDeleteButton, setShowDeleteButton] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // Paginacija
   const [currentPage, setCurrentPage] = useState(1); 
    const [messagesPerPage] = useState(10); 
    const [searchText, setSearchText] = useState("");

  // Učitaj prethodne poruke iz localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (storedUser && storedUser.name) {
      setCurrentUser(storedUser.name);
      setActiveUser(storedUser.name);
    
    }    
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

    const savedUsers = JSON.parse(localStorage.getItem(`users_${roomId}`)) || [];
    setUsers(savedUsers);

    if (savedUsers.length > 0 && !storedUser) {//ako nema ulogovanog korisnika, postavlja prvog iz liste kao ulogovanog 
      setCurrentUser(savedUsers[0]);
      setActiveUser(savedUsers[0]);
    }
  }, [roomId]);

  const filteredMessages = messages.filter(msg => msg.content.toLowerCase().includes(searchText.toLowerCase()));

  // Paginacija
  const { indexOfLastMessage, indexOfFirstMessage, currentMessages, handleNextPage, handlePreviousPage } = usePagination(filteredMessages, currentPage, messagesPerPage);

  
    const { emojiList, loading } = useEmojis(); 

    const addEmojiToMessage = (emoji) => {
      setMessage((prevMessage) => prevMessage + emoji);
    };
    

  const handleMouseEnter = (index) => {
    setShowDeleteButton(index);
  };
  
  const handleMouseLeave = () => {
    setShowDeleteButton(null);
  };
  
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1); // Resetuj stranicu na prvu kada se pretraga menja
  };
  
  const sendMessage = () => {
    if (message.trim() && currentUser) {
      // Dodajte novu poruku u niz
      const newMessage = {
        user: activeUser,
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

  const addUser = () => {
    if (newUserName.trim() && !users.includes(newUserName)) {
      const updatedUsers = [...users, newUserName];
      setUsers(updatedUsers);
      localStorage.setItem(`users_${roomId}`, JSON.stringify(updatedUsers));
      setNewUserName("");
    }
  };
  const handleDelete = (index) => {
    const updatedMessages = [...messages];
    updatedMessages.splice(index, 1);  // Uklanja poruku na datom indeksu
    setMessages(updatedMessages);
    
    // Čuvanje ažuriranih poruka u localStorage
    localStorage.setItem(roomId, JSON.stringify(updatedMessages));
  };

  const switchUser = (user) => {
    setActiveUser(user);
  };
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  
  return (
    <div className="chat-room-container">
      <h2>Chat Grupa: {roomName || 'Loading...'}</h2>

      <div className="add-user-container">
        <input
          className='input-message'
          type="text"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addUser()} 
          placeholder="Unesite ime korisnika"
        />
        
        <button className='add-user-button' onClick={addUser}>Dodaj korisnika</button>
      </div>
      <div className="search-container">
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Pretraži poruke..."
        />
      </div>

      <div className="user-switch-container">
        <span>Trenutno piše kao: <strong>{activeUser}</strong></span>
        <button className="current-user-button" onClick={() => switchUser(currentUser)}>
          {currentUser}
        </button>
        {users.map((user, index) => (
          <button key={index} onClick={() => switchUser(user)}>
            Prebaci na {user}
          </button>
        ))}
      </div>


      <div className="chat-window" style={backgroundStyle}>
      
        {currentMessages.map((msg, index) => (
          <div
            key={index} className={`message ${msg.user === currentUser ? "my-message" : "other-message"}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <strong>{msg.user}:</strong> {msg.content}
      
            {showDeleteButton === index && (
              <button
                className="delete-button"
                onClick={() => handleDelete(index)}
              >
                Obrisi poruku ❌
              </button>
            )}
            </div>
      ))}
      </div>
      <div className="pagination-controls">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Prethodna
        </button>
        <button
          onClick={handleNextPage}
          disabled={indexOfLastMessage >= messages.filter(msg => msg.content.toLowerCase().includes(searchText.toLowerCase())).length}
        >
          Sledeća
        </button>
      </div>
      <div className='send-message-all'>
      <input
        className="input-message"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()} 
        placeholder="Unesite poruku"
      />
      <button className="send-message-button" onClick={sendMessage}>
        Pošaljite
      </button>
      <div className="emoji-picker-container">
      <button
       className="emoji-button"
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
      >
        😊
      </button>
      {showEmojiPicker && (
      <div className="emoji-picker">
        {
          loading ? (
            <p>Učitavanje emojija...</p>
          ):( 
            emojiList.length > 0 ? (
          emojiList.slice(0, 50).map((emojiData, index) => (
            <span
               key={index}
              onClick={() => addEmojiToMessage(emojiData.emoji || String.fromCodePoint(parseInt(emojiData.htmlCode[0].replace('&#', '').replace(';', ''))))}
              style={{ cursor: "pointer", fontSize: "20px", margin: "5px" }}
              >
              {emojiData.emoji || String.fromCodePoint(parseInt(emojiData.htmlCode[0].replace('&#', '').replace(';', '')))}
            </span>
          ))
        ) : (
          <p>Nemamo dostupnih emojija!</p>
        )
        )}
      </div>
    )}

    </div>
    </div>
  </div>
    
  );
};

export default ChatRoom;
