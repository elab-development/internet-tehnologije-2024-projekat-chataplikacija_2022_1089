import React,{useState} from "react";
import "../styles/GlavnaStr.css";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import ChatPanel from "./ChatPanel";



const GlavnaStr = () => {
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  return (
    <div className="container">
      <div className="left-panel"><LeftPanel onGroupSelect={setSelectedGroupId} /> </div>
      <div className="chat-panel"><ChatPanel selectedGroupId={selectedGroupId}/></div>
      <div className="right-panel"><RightPanel selectedGroupId={selectedGroupId}/></div>
    </div>
  );
};

export default GlavnaStr;