import React,{useState, useEffect, useCallback} from "react";
import "../styles/GlavnaStr.css";
import LeftPanel from "./LeftPanel";
import { useNavigate } from 'react-router-dom';
import RightPanel from "./RightPanel";
import ChatPanel from "./ChatPanel";
import GroupActivityChart from './GroupActivityChart';
import { Typography, Box} from "@mui/material";
import { AlertDialogProvider } from './AlertDialogContext';
import axios from "axios";


const GlavnaStr = () => {
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [showStatistics, setShowStatistics] = useState(false);
  const [maxPoruka, setMaxPoruka] =useState(null);
  const [leaveGroup, setLeaveGroup] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
 
    const fetchCurrentUser = async () => {
        try {
          const storedUser = sessionStorage.getItem('ulogovani_user');

          await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
          await new Promise(resolve => setTimeout(resolve, 200));

          if (storedUser) {
            const user = JSON.parse(storedUser);
              if (user.role === 'guest') {
                console.log('Guest user detected, validating session...');
                try {
                  const response = await axios.get('/api/user', { withCredentials: true });
                  setCurrentUser(response.data);
                  console.log('Guest session valid');
                } catch (guestError) {
                  console.log('Guest session invalid, removing...');
                  throw guestError; 
                }
              } else {
                console.log('Regular user, using stored data');
                setCurrentUser(user);
              }

          }else {
            const response = await axios.get('/api/user', { withCredentials: true });
            sessionStorage.setItem('ulogovani_user', JSON.stringify(response.data));
            setCurrentUser(response.data);
          }
        
        } catch (error) {
         
           console.error("Sesija ne važi:", error);
            sessionStorage.removeItem('ulogovani_user');
            navigate('/');
        
        }
      };
    
    fetchCurrentUser();
  }, [navigate]);

  


  useEffect(() => {
    if (leaveGroup) {
      setTimeout(() => setLeaveGroup(false), 100); // Resetuj flag nakon kratkog odlaganja
    }
  }, [leaveGroup]);

  const handleMaxGroupFound = useCallback((maxGroup) => {
    setMaxPoruka(maxGroup);
  },[]);
 
  const toggleStatistics = () => {
    setShowStatistics(!showStatistics);
  };

  return (
    <div className="container">
      <AlertDialogProvider>
        <div className="left-panel"><LeftPanel onGroupSelect={setSelectedGroupId} onLeaveGroup={leaveGroup} currentUser={currentUser}/> </div>
        <div className="chat-panel"><ChatPanel selectedGroupId={selectedGroupId} onGroupDeleted={(newValue) => setSelectedGroupId(newValue)} onLeaveGroup={setLeaveGroup} currentUser={currentUser}/></div>
        <div className="right-panel"><RightPanel selectedGroupId={selectedGroupId} onStatisticsClick={toggleStatistics} currentUser={currentUser} /></div>
      </AlertDialogProvider>

      {showStatistics && (
        <div className="statistics-overlay" onClick={() => setShowStatistics(false)}>
          <div className="statistics-container" onClick={(e) => e.stopPropagation()}>
            <button className="close-statistics" onClick={() => setShowStatistics(false)}>
              Zatvori
            </button>
          <GroupActivityChart onMaxGroupFound={handleMaxGroupFound} />
          {maxPoruka && (
            <Box sx={{ mt: 2, textAlign:'center'} }>
            <Typography>
            Najaktivnija grupa: <Typography component="span" fontWeight="bold" display="inline" >{maxPoruka.name+" "}</Typography> 
            sa <Typography component="span" fontWeight="bold" display="inline">{maxPoruka.poruke}</Typography> poruka
            </Typography>
            </Box>
          )}
          </div>
        </div>
      )}
   </div>
  );
};

export default GlavnaStr;