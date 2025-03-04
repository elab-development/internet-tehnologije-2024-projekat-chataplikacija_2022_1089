import React, { useState } from 'react';
import '../styles/ChatInterface.css';

// Main Chat Interface Component
const ChatInterface = () => {
  const [contacts] = useState([
    { id: 1, name: 'John Doe', avatar: '/avatar1.png', lastMessage: 'Hey, how are you?', unread: false },
    { id: 2, name: 'Jane Smith', avatar: '/avatar2.png', lastMessage: 'Meeting at 3pm', unread: true },
    { id: 3, name: 'Team Alpha', avatar: '/avatar3.png', lastMessage: 'Project deadline tomorrow', unread: false },
    { id: 4, name: 'Support Group', avatar: '/avatar4.png', lastMessage: 'New ticket opened', unread: false },
  ]);
  
  const [activeContact, setActiveContact] = useState(contacts[0]);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleContactSelect = (contact) => {
    setActiveContact(contact);
  };

  return (
    <div className="chat-container">
      {/* Left sidebar - contacts/groups */}
      <div className="contacts-panel">
        <div className="contacts-header">
          <h2>Chats</h2>
        </div>
        
        <div className="contacts-group">
          <div className="group-header">
            <span className="group-title">My chats</span>
            <span className="group-count">3 (+1 idle)</span>
          </div>
          
          <div className="contacts-list">
            {contacts.map(contact => (
              <div 
                key={contact.id} 
                className={`contact-item ${activeContact.id === contact.id ? 'active' : ''}`}
                onClick={() => handleContactSelect(contact)}
              >
                <img src={contact.avatar} alt={contact.name} className="avatar" />
                <div className="contact-info">
                  <div className="contact-name">{contact.name}</div>
                  <div className="contact-message">{contact.lastMessage}</div>
                </div>
                {contact.unread && <span className="unread-badge"></span>}
              </div>
            ))}
          </div>
        </div>
        
        <div className="contacts-group">
          <div className="group-header">
            <span className="group-title">Supervised chats</span>
            <span className="group-count">1</span>
          </div>
          {/* Supervised chats would go here */}
        </div>
        
        <div className="contacts-group">
          <div className="group-header">
            <span className="group-title">Queued chats</span>
            <span className="group-count">2</span>
          </div>
          {/* Queued chats would go here */}
        </div>
      </div>
      
      {/* Middle section - chat window */}
      <div className="chat-panel">
        <div className="chat-header">
          <div className="chat-title">
            <img src={activeContact.avatar} alt={activeContact.name} className="avatar small" />
            <span>{activeContact.name}</span>
          </div>
          <div className="chat-actions">
            <button className="icon-button more-options" onClick={() => setShowUserMenu(!showUserMenu)}>
              <i className="fas fa-ellipsis-h"></i>
            </button>
          </div>
        </div>
        
        <div className="messages-container">
          <div className="date-separator">Today</div>
          
          <div className="message received">
            <img src={activeContact.avatar} className="avatar small" alt="" />
            <div className="message-bubble">
              <div className="message-content">
                <div className="form-prompt">
                  <div>Your name:</div>
                  <div className="form-field"></div>
                  
                  <div>E-mail:</div>
                  <div className="form-field"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="message sent">
            <div className="message-bubble">
              <div className="message-content">Hi there, I'm interested in your services</div>
            </div>
            <img src="/user-avatar.png" className="avatar small" alt="" />
          </div>
        </div>
        
        <div className="message-input">
          <div className="input-actions">
            <button className="icon-button"><i className="fas fa-hashtag"></i></button>
            <button className="icon-button"><i className="fas fa-paperclip"></i></button>
            <button className="icon-button"><i className="fas fa-smile"></i></button>
          </div>
          <input type="text" placeholder="Type a message..." />
          <button className="send-button">Send</button>
        </div>
      </div>
      
      {/* Right panel - user details */}
      <div className="details-panel">
        <div className="details-header">
          <h2>Details</h2>
          <button className="icon-button more-options"><i className="fas fa-ellipsis-h"></i></button>
        </div>
        
        <div className="details-content">
          <div className="details-section">
            <h3>General Info</h3>
            <div className="user-profile">
              <img src={activeContact.avatar} alt={activeContact.name} className="avatar large" />
              <div className="user-name">{activeContact.name}</div>
              
              <div className="info-item">
                <i className="fas fa-clock"></i>
                <span>Last seen: 5 minutes ago</span>
              </div>
              
              <div className="info-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>Location: New York</span>
              </div>
            </div>
            
            <div className="map-container">
              <img src="/map-placeholder.png" alt="User location" className="location-map" />
              <div className="address">228 Park Avenue South</div>
            </div>
          </div>
          
          <div className="details-section">
            <h3>Pre-chat survey</h3>
            <div className="survey-info">
              <div className="survey-item">
                <span>Your name:</span>
                <span className="survey-value">John Smith</span>
              </div>
              <div className="survey-item">
                <span>E-mail:</span>
                <span className="survey-value">john.smith@example.com</span>
              </div>
            </div>
          </div>
          
          <div className="details-section">
            <h3>Visited pages</h3>
            <div className="visited-pages">
              <div className="visited-item">
                <span>Visits:</span>
                <span>3 times</span>
              </div>
              <div className="page-item">
                <i className="fas fa-file"></i>
                <span>Homepage</span>
              </div>
              <div className="page-item">
                <i className="fas fa-file"></i>
                <span>Products</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dropdown menu for adding users, searching messages, etc. */}
      {showUserMenu && (
        <div className="dropdown-menu">
          <ul>
            <li><i className="fas fa-user-plus"></i> Add user to group</li>
            <li><i className="fas fa-search"></i> Search messages</li>
            <li><i className="fas fa-cog"></i> Settings</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;