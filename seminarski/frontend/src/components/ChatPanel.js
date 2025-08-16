import React, {useState, useEffect, useRef, useCallback} from 'react'
import "../styles/ChatPanel.css";
import SearchIcon from '@mui/icons-material/Search';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import { Button, Avatar, Tooltip, Box, IconButton, MenuItem } from '@mui/material';
import axios from 'axios';
import SendIcon from '@mui/icons-material/Send';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditIcon from '@mui/icons-material/Edit';
import EmojiPicker from 'emoji-picker-react';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import SearchMessages from './SearchMessages';
import DeleteIcon from '@mui/icons-material/Delete';
import WallpaperSelector from './WallpaperSelector';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import { useAlertDialog } from './AlertDialogContext';
import CloseIcon from '@mui/icons-material/Close';
import GifSelector from './GifSelector';
import GifIcon from '@mui/icons-material/Gif';

function ChatPanel({ selectedGroupId, onGroupDeleted, onLeaveGroup, currentUser }) {

    const [groupName, setGroupName] = useState("");
    const [message, setMessage] =useState("");
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [editingMessage, setEditingMessage] = useState(null);
    const [editMessageContent, setEditMessageContent] = useState("");
    const [showEditEmojiPicker, setShowEditEmojiPicker] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [openWallpapers, setOpenWallpapers] = useState(false);
    const [openGifPicker, setOpenGifPicker] = useState(false);
    const wallpaperRef=useRef(null);
    const [filteredMessages, setFilteredMessages] = useState(null);
    const [wallpaperUrl, setWallpaperUrl] = useState('');
    const { showConfirmDialog, showAlertDialog } = useAlertDialog();


    const handleGetWallpaper = useCallback(async () => {
      // dohvata pozadinu iz baze
      if (!selectedGroupId) return;
      try {
        const response = await axios.get(`/api/groups/${selectedGroupId}/wallpaper`);
        setWallpaperUrl(response.data.wallpaper);
      } catch (error) {
        console.error("Greška pri dohvatanju pozadine:", error.response || error.message);
      }
    }, [selectedGroupId]);

    
    useEffect(() => {
        if (!selectedGroupId) {
          setGroupName("Izaberite grupu");
          setFilteredMessages(null); 
        return;
        }
        setFilteredMessages(null);

        const fetchGroupName = async () => {
          
             try {
                let response;
                if (currentUser?.role === 'admin') {
                        response = await axios.get('/api/groupsAdm'); 
                    } else {
                        response = await axios.get('/api/groups', {
                            params: {
                                user_id: currentUser?.id,
                                user_role: currentUser?.role
                            }
                        });
                    }
                    
                    
                    const foundGroup = response.data.groups.find(group => group.id === selectedGroupId);
                    
                    
                    setGroupName(foundGroup?.name || "(Grupa nije pronađena)");
                    
                } catch (error) {
                    console.error("Greška pri dohvatanju imena grupe:", error);
                    setGroupName("(Greška pri učitavanju)");
                }
            };

        const fetchMessages = async () => {
            try {
              await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
              const response = await axios.get(`/api/messages/${selectedGroupId}`, {
                withCredentials:true
              });
              setMessages(response.data.messages);
            } catch (error) {
               console.error("Greška pri dohvatanju poruka:", error);
            }
         };
        
        fetchGroupName();
        fetchMessages();
        handleGetWallpaper(); 
       
    }, [selectedGroupId, handleGetWallpaper, currentUser]);



    // Automatski scroll na dno chata kada stižu nove poruke
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    const handleSendMessage = async (customMessage=null) => {
      
          const messageToSend = customMessage !== null ? 
            (typeof customMessage === 'string' ? customMessage : JSON.stringify(customMessage)) : 
            message;

            if (!messageToSend || typeof messageToSend !== 'string' ||
               !messageToSend.trim() || !selectedGroupId) return;
      
          
            const token = localStorage.getItem('token_ulogovanog');
            if (!token) {
              console.error('Token nije pronađen');
              return;
            }
            
            try {
              const response = await axios.post(`/api/messages/${selectedGroupId}`, {
                content: messageToSend},{
                withCredentials: true
              });
              
              const newMessage = response.data.message;
              setMessages(prevMessages => [...prevMessages, newMessage]);
              
              
              if (!customMessage) {
                setMessage("");
              }
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
            
          const confirmed = await showConfirmDialog(
            "Potvrda brisanja", 
            "Da li ste sigurni da želite da obrišete ovu poruku?"
          );
          
          
          if (!confirmed) {
            return;
          }
             await axios.delete(`/api/messages/${messageId}`, {
             withCredentials:true
              
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
            setSelectedMessage(null);
          }
    }

    const submitEditMessage = async () => {
        try {
         
          const response =await axios.put(`/api/messages/${editingMessage}`, 
           
            { content: editMessageContent },
            { withCredentials:true}

          );

          await new Promise(resolve => setTimeout(resolve, 300));
         
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === editingMessage ? { ...response.data.message, user: msg.user } : msg
            )
          );
          
          
          setEditingMessage(null);
          setEditMessageContent("");
          
        } catch (error) {
          console.error("Greška pri editovanju poruke:", error.response || error.message);
        }
      };
      const handleDeleteGroup = async (groupId) => {
        try {
            
            
          const confirmed = await showConfirmDialog(
            "Potvrda brisanja", 
            "Da li ste sigurni da želite da obrišete ovu grupu?"
          );
          
          
          if (!confirmed) {
            return;
          }

             await axios.delete(`/api/groups/${groupId}`);
            onGroupDeleted(null);
            onLeaveGroup(true);
      
           
            setGroupName("Izaberite grupu");
            setMessages([]);
            setWallpaperUrl(null);
           
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

      const handleSearchToggle = async() => {
        if (selectedGroupId) {
          
          setIsSearchVisible(!isSearchVisible);
        } else {
          await showAlertDialog(
            "Upozorenje", 
            "Morate prvo da izaberete grupu!"
          );
         
        }
      };
      const handleCloseSearchToggle=()=>{
        if (selectedGroupId) {
          setIsSearchVisible(false);
          setFilteredMessages(null);
        }
      }
      const handleDeleteToggle= async()=> {
        if (selectedGroupId) {
          handleDeleteGroup(selectedGroupId);
        } else {
          await showAlertDialog(
            "Upozorenje", 
             "Morate prvo da izaberete grupu!"
          );
        
        }
      };

      const handleLeaveToggle =async()=>{
        if (selectedGroupId) {
          handleLeaveGroup(currentUser.id, selectedGroupId);
        } else {
          await showAlertDialog(
            "Upozorenje", 
             "Morate prvo da izaberete grupu!"
          );
         
        }
      }


      const handleSearchResults = (results) => {
        setFilteredMessages(results);
      };

      const handleLeaveGroup= async (userId, groupId)=>{
        try {
            
          const confirmed = await showConfirmDialog(
            "Potvrda", 
            "Da li ste sigurni da želite da napustite ovu grupu?"
          );
          
          
          if (!confirmed) {
            return;
          }
          
          const token = localStorage.getItem('token_ulogovanog');
          
           await axios.delete(`/api/groups/${userId}/${groupId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          onLeaveGroup(true);
          
          setGroupName("Izaberite grupu");
          setMessages([]);
          
        } catch (error) {
          console.error("Greška pri napustanju grupe:", error.response || error.message);
        }   

      }
      

      const handleWallpapersToggle = async () => {
        if (selectedGroupId) {
         
         setOpenWallpapers(!openWallpapers);
        } else {
          await showAlertDialog(
            "Upozorenje", 
             "Morate prvo da izaberete grupu!"
          );
         
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
        
        try{
          const response= await axios.post(`/api/groups/${selectedGroupId}/wallpaper`,{
              wallpaper:imageUrl
        });

        console.log('Uspesno dodata pozadina:', response.data);

        }catch(error){
          console.error("Greška pri napustanju grupe:", error.response || error.message);
        }
        handleGetWallpaper();
        setOpenWallpapers(false); 
      };
     

      const handleDeleteWallpaper =async()=>{
        try{
          const response= await axios.delete(`/api/groups/${selectedGroupId}/wallpaper`);

        
          setWallpaperUrl(response.data.wallpaper);

        }catch(error){
          console.error("Greška pri brisanju pozadine:", error.response || error.message);
        }
      }
      const [anchorEl, setAnchorEl] = React.useState(null);
      const openMenu = Boolean(anchorEl);
      const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
      };
      const handleCloseMenu = () => {
        setAnchorEl(null);
      };
      const handleSearchAction = () => {
        handleSearchToggle(); 
        handleCloseMenu();
      };
      
      const handleWallpaperAction = () => {
        handleWallpapersToggle(); 
        handleCloseMenu();
      };
      
      const handleLeaveAction = () => {
        handleLeaveToggle(); 
        handleCloseMenu();
      };
      
      const handleDeleteAction = () => {
        handleDeleteToggle(); 
        handleCloseMenu();
      };

      const handleOpenGifPicker = () => {
        setOpenGifPicker(true);
      };
      
      const handleCloseGifPicker = () => {
        setOpenGifPicker(false);
      };
      const handleSelectGif = (gifUrl) => {
        handleSendMessage(`[GIF]${gifUrl}`);
        console.log("Odabrani GIF:", gifUrl);
        setOpenGifPicker(false);
      };

  return (
    <div className='chat-panel-str'>
        <div className='chat-panel-header'>
            <h2>{groupName}</h2> 
            <div className='buttons'>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            {isSearchVisible && (
                  <div className='search_field' style={{ display: 'flex', alignItems:'center' }} >
                      <SearchMessages 
                        messages={messages}
                        onSearchResults={handleSearchResults}
                      />
                      <Tooltip title={"Zatvori"} arrow>
                      <button className='closeSearchButton' onClick={handleCloseSearchToggle}><CloseIcon/></button></Tooltip>
                  </div>
                  
              )}
              <Tooltip title="Opcije" arrow>
              <IconButton
                onClick={handleClickMenu}
                size="small"
                sx={{ mr: 2 }}
                aria-controls={openMenu ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openMenu ? 'true' : undefined}
              >
                <MoreVertIcon />
              </IconButton></Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={openMenu}
            onClose={handleCloseMenu}
            
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  width:'250px',
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: 0,
                    mr: 0,
                  },
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 10,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleSearchAction} sx={{ 
                pl: 3, 
                pr: 1,
                py: 1, 
                gap:1,
                width: '100%', 
                '& .MuiSvgIcon-root': { 
                  pr: 1,
                  fontSize:27, 
                }
              }}>
              <SearchIcon /> Pretraži poruke
            </MenuItem>
            {currentUser && currentUser.role !== 'guest' && (
            <MenuItem onClick={handleWallpaperAction} sx={{ 
                pl: 3, 
                pr: 1, 
                py: 1, 
                gap:1,
                width: '100%', 
                '& .MuiSvgIcon-root': { 
                  pr: 1, 
                  fontSize:27,
                }
              }}>
              <WallpaperIcon/> Promeni pozadinu 
            </MenuItem>
            )}
            {currentUser && currentUser.role !== 'admin' &&(
            <MenuItem onClick={handleLeaveAction} sx={{ 
                pl: 3.3, 
                pr: 1, 
                py: 1, 
                gap:1,
                width: '100%', 
                '& .MuiSvgIcon-root': { 
                  pr: 1,
                  fontSize:27,
                }
              }}>
              <GroupRemoveIcon/> Napusti grupu
            </MenuItem>)}
            {currentUser && currentUser.role !== 'guest' && (
            <MenuItem onClick={handleDeleteAction} sx={{ 
                pl: 3, 
                pr: 1, 
                py: 1, 
                gap:1,
                width: '100%', 
                '& .MuiSvgIcon-root': { 
                  pr:1,
                  fontSize:27,
                }
                
              }}>
              <DeleteIcon /> Obriši grupu
            </MenuItem>)}
          </Menu>
              
               <WallpaperSelector    
              open={openWallpapers}
              onClose={handleCloseWallpapers}
              onSelectWallpaper={handleSelectWallpaper}
              onDeleteWallpaper= {handleDeleteWallpaper}
            />
              
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
                      : (currentUser && currentUser.role === 'admin') ? "Nema poruka u ovoj grupi!" : "Još nema poruka. Budite prvi koji će započeti razgovor!"}
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
                                <Tooltip title="Obriši" arrow>
                                <button className="delete-button" onClick={(e) => {
                                  e.stopPropagation();
                                    handleDeleteMessage(msg.id);
                                }}>
                                  <DeleteOutlineRoundedIcon />
                                </button></Tooltip>
                                <Tooltip title="Edituj" arrow>
                                <button className="edit-message-button" onClick={(e) => {
                                  e.stopPropagation();
                                    handleEditMessage(msg.id);
                                }}>
                                  <EditIcon />
                                </button></Tooltip>
                              </div>
                            )}
                            
                            <div className="message-content">
                              <div className="message-header">
                                <span className="message-author">{msg.user?.username || 'Nepoznat'}</span>
                                <span className="message-time">{formatDate(msg.created_at)}</span>
                                {msg.created_at !== msg.updated_at && <span className="edited-label">(edited)</span>}
                              </div>
                              <div className="message-text">

                              {msg.content.startsWith('[GIF]') ? (
                                <img 
                                  src={msg.content.substring(5)} 
                                  alt="GIF" 
                                  className="message-gif"
                                  style={{ maxWidth: '250px', borderRadius: '8px' }}
                                />
                              ) : (
                                msg.content
                              )}
                              </div>
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
        {currentUser && currentUser.role !== 'admin' &&(
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
                className="gif-button" 
                onClick={handleOpenGifPicker}
            >
                <GifIcon />
            </button>
            <button 
                className="emoji-button" 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
                <EmojiEmotionsOutlinedIcon />
            </button>
            
           <GifSelector 
              open={openGifPicker}
              onClose={handleCloseGifPicker}
              onSelectGif={handleSelectGif}
            />
             
            {showEmojiPicker && (
                <div className="emoji-picker-wrapper">
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
            )}
            </div>
            <Button
                className='send-message-button'
                variant="contained"
                onClick={() => handleSendMessage()}
                size='small'
            >
                <SendIcon/>
            </Button>
        </div>)}
    </div>
    
  )
}

export default ChatPanel