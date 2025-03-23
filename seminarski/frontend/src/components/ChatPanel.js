import React, {useState, useEffect, useRef} from 'react'
import "../styles/ChatPanel.css";
import SearchIcon from '@mui/icons-material/Search';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import { Button, Avatar } from '@mui/material';
import axios from 'axios';
import SendIcon from '@mui/icons-material/Send';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditIcon from '@mui/icons-material/Edit';
import EmojiPicker from 'emoji-picker-react';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';

function ChatPanel({ selectedGroupId }) {

    const [groupName, setGroupName] = useState("");
    const [message, setMessage] =useState("");
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const messagesEndRef = useRef(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [editingMessage, setEditingMessage] = useState(null);
    const [editMessageContent, setEditMessageContent] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    
    
    useEffect(() => {
        if (!selectedGroupId) return;

        const fetchGroupName = async () => {
            try {
                const response = await axios.get('/api/groups'); 
                const foundGroup = response.data.groups.find(group => group.id === selectedGroupId);
                setGroupName(foundGroup?.name || "(Izaberite grupu)");
            } catch (error) {
                console.error("Greška pri dohvatanju imena grupe:", error);
                setGroupName("(Izaberite grupu)");
                }
            };
            const fetchMessages = async () => {
                try {
                    const response = await axios.get(`/api/messages/${selectedGroupId}`);
                    setMessages(response.data.messages);
                } catch (error) {
                    console.error("Greška pri dohvatanju poruka:", error);
                }
            };
        
        fetchGroupName();
        fetchMessages();
      
       
    }, [selectedGroupId]);

    // Dohvati trenutnog korisnika
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get('/api/user');
                setCurrentUser(response.data);
            } catch (error) {
                console.error("Greška pri dohvatanju korisnika:", error);
            }
        };

         fetchCurrentUser();
    }, []);

    // Automatski scroll na dno chata kada stižu nove poruke
        useEffect(() => {
            scrollToBottom();
        }, [messages]);

        const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        };
    
    const handleSendMessage = async () => {
        if (!message.trim() || !selectedGroupId) return;
        const token=localStorage.getItem('token_ulogovanog');
        if (!token) {
            console.error('Token nije pronađen');
            return;
        }
        try {
            const response=await axios.post(`/api/messages/${selectedGroupId}`, {
                content: message
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            
            });
            const newMessage = response.data.message;
            setMessages(prevMessages => [...prevMessages, newMessage]);
            setMessage(""); 
        } catch (error) {
            console.error("Greška pri slanju poruke:", error.response || error.message);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    const handleDeleteMessage = async (messageId) => {
        try {
            // Prikazivanje potvrdnog dijaloga pre brisanja
            if (!window.confirm("Da li ste sigurni da želite da obrišete ovu poruku?")) {
              return;
            }
            
            // Dohvatanje tokena iz localStorage-a (pretpostavljam da koristite ovu metodu autentifikacije)
            const token = localStorage.getItem('token_ulogovanog');
            
            // Slanje DELETE zahteva na Laravel backend
             await axios.delete(`/api/messages/${messageId}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
        
            setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
            
            
            setSelectedMessage(null);
            
           
          } catch (error) {
            console.error("Greška pri brisanju poruke:", error.response || error.message);
          }   
    }

    const handleEditMessage = async (messageId) => {
        
          const message = messages.find(msg => msg.id === messageId);
          if (message) {
            setEditingMessage(messageId);
            setEditMessageContent(message.content);
            // Zatvoriti meni sa opcijama
            setSelectedMessage(null);
          }
    }

    const submitEditMessage = async () => {
        try {
          const token = localStorage.getItem('token_ulogovanog');
          
          await axios.put(`/api/messages/${editingMessage}`, 
            { content: editMessageContent },
            { 
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          // Ažuriranje lokalne liste poruka
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === editingMessage ? { ...msg, content: editMessageContent } : msg
            )
          );
          
          // Resetujemo stanje editovanja
          setEditingMessage(null);
          setEditMessageContent("");
          
        } catch (error) {
          console.error("Greška pri editovanju poruke:", error.response || error.message);
        }
      };
      const onEmojiClick = (emojiObject) => {
        setMessage(prevMessage => prevMessage + emojiObject.emoji);
        
        setShowEmojiPicker(false);
      };

  return (
    <div className='chat-panel-str'>
        <div className='chat-panel-header'>
            <h2>{groupName}</h2> 
            <div className='buttons'>
                <Button
                className='search-button'
                variant="contained"
                //onClick={}
                size='small'
            >
                <SearchIcon />
            </Button>
            
            <Button
                className='change-wallpaper-button'
                variant="contained"
                //onClick={handleLogout}
                size='small'
            >
                <WallpaperIcon/>
            </Button>
            <Button
                className='leave-group-button'
                variant="contained"
                //onClick={handleLogout}
                size='small'
            >
                <GroupRemoveIcon/>
            </Button>
          </div>
        </div>
        <div className='chat-window'>
        {messages.length === 0 ? (
                    <p className="no-messages">Još nema poruka. Budite prvi koji će započeti razgovor!</p>
                ) : (
                    messages.map((msg, index) => {
                        const isOwnMessage = currentUser && msg.user_id === currentUser.id;
                        
                        return(
                            <div
                            key={msg.id || index}
                            className={`message-container ${isOwnMessage ? 'own-message' : 'other-message'}`}
                            onClick={() => isOwnMessage && setSelectedMessage(msg.id === selectedMessage ? null : msg.id)}
                          >
                            <div className="message-avatar">
                              <Avatar>{msg.user?.username?.charAt(0) || '?'}</Avatar>
                            </div>
                            
                            {isOwnMessage && selectedMessage === msg.id && (
                              <div className="message-actions-inline">
                                <button className="delete-button" onClick={(e) => {
                                  e.stopPropagation();
                                    handleDeleteMessage(msg.id);
                                }}>
                                  <DeleteOutlineRoundedIcon />
                                </button>
                                <button className="edit-message-button" onClick={(e) => {
                                  e.stopPropagation();
                                    handleEditMessage(msg.id);
                                }}>
                                  <EditIcon />
                                </button>
                              </div>
                            )}
                            
                            <div className="message-content">
                              <div className="message-header">
                                <span className="message-author">{msg.user?.username || 'Nepoznat'}</span>
                                <span className="message-time">{formatDate(msg.created_at)}</span>
                              </div>
                              <div className="message-text">{msg.content}</div>
                            </div>
                          </div>
                        );
                      })

                        
                )}
                <div ref={messagesEndRef} />

        {editingMessage && (
        <div className="edit-message-modal">
            <div className="edit-message-content">
            <h3>Izmena poruke</h3>
            <textarea 
                value={editMessageContent}
                onChange={(e) => setEditMessageContent(e.target.value)}
                rows="2"
            />
            <div className="modal-actions">
                <button onClick={() => {
                setEditingMessage(null);
                setEditMessageContent("");
                }}>Otkaži</button>
                <button onClick={submitEditMessage}>Sačuvaj</button>
            </div>
            </div>
        </div>
        )}

        </div>
        <div className='create-message-container'>
            <div className='input-message-container'>
            <input
                className="input-message"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
                placeholder="Unesite poruku"
                
            />
            <button 
                className="emoji-button" 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
                <EmojiEmotionsOutlinedIcon />
            </button>
            {showEmojiPicker && (
                <div className="emoji-picker-wrapper">
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
            )}
            </div>
            <Button
                className='send-message-button'
                variant="contained"
                onClick={handleSendMessage}
                size='small'
            >
                <SendIcon/>
            </Button>
        </div>
    </div>
    
  )
}

export default ChatPanel