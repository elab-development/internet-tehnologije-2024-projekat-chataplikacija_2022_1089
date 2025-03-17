import React, {useState, useEffect, useRef} from 'react'
import "../styles/ChatPanel.css";
import SearchIcon from '@mui/icons-material/Search';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import { Button, Avatar } from '@mui/material';
import axios from 'axios';
import SendIcon from '@mui/icons-material/Send';


function ChatPanel({ selectedGroupId }) {

    const [groupName, setGroupName] = useState("");
    const[message, setMessage] =useState("");
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const messagesEndRef = useRef(null);


    
    
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
            setMessage(""); // Očisti input polje
        } catch (error) {
            console.error("Greška pri slanju poruke:", error.response || error.message);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
                    messages.map((msg, index) => (
                        <div
                            key={msg.id || index}
                            className={`message-container ${currentUser && msg.user_id === currentUser.id ? 'own-message' : 'other-message'}`}
                        >
                            <div className="message-avatar">
                                <Avatar>{msg.user?.username?.charAt(0) || '?'}</Avatar>
                            </div>
                            <div className="message-content">
                                <div className="message-header">
                                    <span className="message-author">{msg.user?.username || 'Nepoznat'}</span>
                                    <span className="message-time">{formatDate(msg.created_at)}</span>
                                </div>
                                <div className="message-text">{msg.content}</div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
        </div>
        <div className='create-message-container'>
         <input
            className="input-message"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
            placeholder="Unesite poruku"
        />
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