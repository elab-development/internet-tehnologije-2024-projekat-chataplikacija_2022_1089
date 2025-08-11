import React,{useState, useEffect, useCallback} from "react";
import "../styles/GlavnaStr.css";
import LeftPanel from "./LeftPanel";
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

  useEffect(() => {
    /*const fetchCurrentUser = async () => {
      
      try {
        const response = await axios.get('/api/user', {
          withCredentials: true
        });
        setCurrentUser(response.data);
        //console.log("CurrenUser:", response.data);
      } catch (error) {
        console.error("Greška pri dohvatanju korisnika:", error);
      }
    };*/
    const fetchCurrentUser = async () => {
        try {
          // Prvo proverite da li je admin lokalno ulogovan
          const storedUser = localStorage.getItem('ulogovani_user');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.role === 'admin') {
              setCurrentUser(user);
              return; // Prekini izvršavanje, ne pozivaj API
            }
          }
          
          // Za obične korisnike pozovi API
          const response = await axios.get('/api/user', {
            withCredentials: true
          });
          setCurrentUser(response.data);
        } catch (error) {
          console.error("Greška pri dohvatanju korisnika:", error);
          // Možda je korisnik admin ali API ne radi
          const storedUser = localStorage.getItem('ulogovani_user');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.role === 'admin') {
              setCurrentUser(user);
            }
          }
        }
      };
    
    fetchCurrentUser();
  }, []);

  


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