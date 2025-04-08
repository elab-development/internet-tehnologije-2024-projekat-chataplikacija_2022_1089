import React,{useState} from "react";
import "../styles/GlavnaStr.css";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import ChatPanel from "./ChatPanel";
import GroupActivityChart from './GroupActivityChart';
import { Typography, Box} from "@mui/material";
import { AlertDialogProvider } from './AlertDialogContext';

const GlavnaStr = () => {
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [showStatistics, setShowStatistics] = useState(false);
  const [maxPoruka, setMaxPoruka] =useState(null);
  const [leaveGroup, setLeaveGroup] = useState(false);

  const handleMaxGroupFound = (maxGroup) => {
    setMaxPoruka(maxGroup);
  };
 
  const toggleStatistics = () => {
    setShowStatistics(!showStatistics);
  };

  return (
    <div className="container">
      <AlertDialogProvider>
        <div className="left-panel"><LeftPanel onGroupSelect={setSelectedGroupId} onLeaveGroup={leaveGroup}/> </div>
        <div className="chat-panel"><ChatPanel selectedGroupId={selectedGroupId} onGroupDeleted={(newValue) => setSelectedGroupId(newValue)} onLeaveGroup={setLeaveGroup} /></div>
        <div className="right-panel"><RightPanel selectedGroupId={selectedGroupId} onStatisticsClick={toggleStatistics} /></div>
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