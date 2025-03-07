import React,{useState} from "react";
import "../styles/GlavnaStr.css";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";


const GlavnaStr = () => {
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  return (
    <div className="container">
      <div className="left-panel"><LeftPanel onGroupSelect={setSelectedGroupId} /> </div>
      <div className="main-content">Sredina</div>
      <div className="right-panel"><RightPanel selectedGroupId={selectedGroupId}/></div>
    </div>
  );
};

export default GlavnaStr;