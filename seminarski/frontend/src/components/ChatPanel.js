import React, {useState, useEffect, useRef} from 'react'
import "../styles/ChatPanel.css";
import SearchIcon from '@mui/icons-material/Search';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import { Button, Avatar, Tooltip } from '@mui/material';
import axios from 'axios';
import SendIcon from '@mui/icons-material/Send';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditIcon from '@mui/icons-material/Edit';
import EmojiPicker from 'emoji-picker-react';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import SearchMessages from './SearchMessages';
import DeleteIcon from '@mui/icons-material/Delete';
import WallpaperSelector from './WallpaperSelector';


function ChatPanel({ selectedGroupId, onGroupDeleted, onLeaveGroup }) {

    const [groupName, setGroupName] = useState("");
    const [message, setMessage] =useState("");
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const messagesEndRef = useRef(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [editingMessage, setEditingMessage] = useState(null);
    const [editMessageContent, setEditMessageContent] = useState("");
    const [showEditEmojiPicker, setShowEditEmojiPicker] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [openWallpapers, setOpenWallpapers] = useState(false);
      const wallpaperRef=useRef(null);
    const [filteredMessages, setFilteredMessages] = useState(null);
    const [wallpaperUrl, setWallpaperUrl] = useState('');

    
    useEffect(() => {
        if (!selectedGroupId) {
          setGroupName("Izaberite grupu");
        return;
        }


        const fetchGroupName = async () => {
            try {
                const response = await axios.get('/api/groups'); 
                const foundGroup = response.data.groups.find(group => group.id === selectedGroupId);
                
                setGroupName(foundGroup?.name);
                
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
        handleGetWallpaper(); 
       
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
            
            if (!window.confirm("Da li ste sigurni da želite da obrišete ovu poruku?")) {
              return;
            }
            
            const token = localStorage.getItem('token_ulogovanog');
            
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
          
          const response =await axios.put(`/api/messages/${editingMessage}`, 
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
              msg.id === editingMessage ? response.data.message : msg
            )
          );
          
          // Resetujemo stanje editovanja
          setEditingMessage(null);
          setEditMessageContent("");
          
        } catch (error) {
          console.error("Greška pri editovanju poruke:", error.response || error.message);
        }
      };
      const handleDeleteGroup = async (groupId) => {
        try {
            
            if (!window.confirm("Da li ste sigurni da želite da obrišete ovu grupu?")) {
              return;
            }
            
            const token = localStorage.getItem('token_ulogovanog');
            
             await axios.delete(`/api/groups/${groupId}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            onGroupDeleted(null);
      
            // Resetuj lokalno stanje
            setGroupName("Izaberite grupu");
            setMessages([]);
            
           
          } catch (error) {
            console.error("Greška pri brisanju grupe:", error.response || error.message);
          }   
    }

      const onEmojiClick = (emojiObject) => {
        setMessage(prevMessage => prevMessage + emojiObject.emoji);
        
        setShowEmojiPicker(false);
      };
      const onEditEmojiClick = (emojiObject) => {
        setEditMessageContent(prevContent => prevContent + emojiObject.emoji);
        setShowEditEmojiPicker(false);
      };

      const handleSearchToggle = () => {
        if (selectedGroupId) {
          setIsSearchVisible(!isSearchVisible);
        } else {
          alert("Morate prvo izabrati grupu.");
         
        }
        
      };
      const handleDeleteToggle=()=> {
        if (selectedGroupId) {
          handleDeleteGroup(selectedGroupId);
        } else {
          alert("Morate prvo izabrati grupu.");
         
        }
      };

      const handleLeaveToggle =()=>{
        if (selectedGroupId) {
          handleLeaveGroup(currentUser.id, selectedGroupId);
        } else {
          alert("Morate prvo izabrati grupu.");
         
        }
      }


      const handleSearchResults = (results) => {
        setFilteredMessages(results);
      };

      const handleLeaveGroup= async (userId, groupId)=>{
        try {
            
          if (!window.confirm("Da li ste sigurni da želite da napustite ovu grupu?")) {
            return;
          }
          
          const token = localStorage.getItem('token_ulogovanog');
          
           await axios.delete(`/api/groups/${userId}/${groupId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          onLeaveGroup(true);
          // Resetuj lokalno stanje
          setGroupName("Izaberite grupu");
          setMessages([]);
          
        } catch (error) {
          console.error("Greška pri napustanju grupe:", error.response || error.message);
        }   

      }
      

      const handleWallpapersToggle = () => {
        if (selectedGroupId) {
         
         setOpenWallpapers(!openWallpapers);
        } else {
          alert("Morate prvo izabrati grupu.");
         
        }
        
      };
            
      const handleCloseWallpapers= () => {
        setOpenWallpapers(false);
        
      };

      useEffect(() => {
        function handleClickOutside(event) {
          if (wallpaperRef.current && !wallpaperRef.current.contains(event.target)) {
            setOpenWallpapers(false);
          }
        }
      
        // Dodajemo event listener samo kada je komponenta otvorena
        if (openWallpapers) {
          document.addEventListener("mousedown", handleClickOutside);
        }
        
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [openWallpapers]);

      const handleSelectWallpaper =async(imageUrl) => {
        
        console.log("Odabrana slika:", imageUrl);
        //postavlja sliku u bazu
        try{
          const response= await axios.post(`/api/groups/${selectedGroupId}/wallpaper`,{
              wallpaper:imageUrl
        });

        console.log('Uspesno dodata pozadina:', response.data);

        }catch(error){
          console.error("Greška pri napustanju grupe:", error.response || error.message);
        }
        handleGetWallpaper();
        setOpenWallpapers(false); // Zatvorite dialog nakon izbora
      };
     

      const handleGetWallpaper = async() => {
      //dohvata pozadinu iz baze
        try{
          const response= await axios.get(`/api/groups/${selectedGroupId}/wallpaper`);

        
          setWallpaperUrl(response.data.wallpaper);

        }catch(error){
          console.error("Greška pri dohvatanju pozadine:", error.response || error.message);
        }

      };

      const handleDeleteWallpaper =async()=>{
        try{
          const response= await axios.delete(`/api/groups/${selectedGroupId}/wallpaper`);

        
          setWallpaperUrl(response.data.wallpaper);

        }catch(error){
          console.error("Greška pri brisanju pozadine:", error.response || error.message);
        }
      }
      

  return (
    <div className='chat-panel-str'>
        <div className='chat-panel-header'>
            <h2>{groupName}</h2> 
            <div className='buttons'>
              {isSearchVisible && (
                  <div className='search_field'>
                      <SearchMessages 
                        messages={messages}
                        onSearchResults={handleSearchResults}
                      />
                  </div>
              )}
              <Tooltip title="Pretraži poruke" arrow>
                <Button className='search-button'
                variant="contained"
                onClick={handleSearchToggle}
                size='small'
            >
                <SearchIcon />
            </Button>
           </Tooltip>

            <WallpaperSelector    
              open={openWallpapers}
              onClose={handleCloseWallpapers}
              onSelectWallpaper={handleSelectWallpaper}
              onDeleteWallpaper= {handleDeleteWallpaper}
            />
                  
           <Tooltip title="Promeni pozadinu" arrow>
            <Button
                className='change-wallpaper-button'
                variant="contained"
                onClick={handleWallpapersToggle}
                size='small'
            >
                <WallpaperIcon/>
            </Button>
            </Tooltip>

            <Tooltip title="Napusti grupu" arrow>
            <Button
                className='leave-group-button'
                variant="contained"
                onClick={handleLeaveToggle}
                size='small'
            >
                <GroupRemoveIcon/>
            </Button>
            </Tooltip>
            <Tooltip title="Obriši grupu" arrow>
            <Button
                className='delete-group-button'
                variant="contained"
                onClick={handleDeleteToggle}
                size='small'
            >
                <DeleteIcon/>
            </Button>
            </Tooltip>
          </div>
        </div>
        
        <div className="chat-window" style={{ 
          backgroundImage: wallpaperUrl ? `url(${wallpaperUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundColor: wallpaperUrl ? 'rgba(133, 163, 196, 0.43)' : 'transparent',
          backgroundBlendMode: wallpaperUrl ? 'darken' : 'normal',
          }}>
        {groupName === "Izaberite grupu" ? (
          <p className="no-messages">⬅ Kliknite na grupu u kojoj zelite chatovati!</p>
        ) : (
         (filteredMessages || messages).length === 0 ? (
                    <p className="no-messages">
                      {filteredMessages ? "Nema rezultata pretrage." 
                      : "Još nema poruka. Budite prvi koji će započeti razgovor!"}
                      </p>
                ) : (
                  (filteredMessages ||messages).map((msg, index) => {
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
                                {msg.created_at !== msg.updated_at && <span className="edited-label">(edited)</span>}
                              </div>
                              <div className="message-text">{msg.content}</div>
                            </div>
                          </div>
                        );
                      })

                        
                )
                )}
                <div ref={messagesEndRef} />

        {editingMessage && (
        <div className="edit-message-modal">
            <div className="edit-message-content">
            <h3>Izmena poruke</h3>
            <div className='input-message-container-edit'>
              <input className='input-message-edit'
                type="text"
                value={editMessageContent}
                onChange={(e) => setEditMessageContent(e.target.value)}
                placeholder="Unesite poruku"
            />

             <button className="emoji-button" 
              onClick={() => setShowEditEmojiPicker(!showEditEmojiPicker)}
            >
                <EmojiEmotionsOutlinedIcon />
            </button>
            {showEditEmojiPicker && (
                <div className="emoji-picker-wrapper">
                    <EmojiPicker onEmojiClick={onEditEmojiClick} />
                </div>
            )}
            </div>
            
            
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