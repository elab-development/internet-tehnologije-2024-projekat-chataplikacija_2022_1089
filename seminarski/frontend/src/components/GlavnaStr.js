import React from "react";
import "../styles/GlavnaStr.css";
import LeftPanel from "./LeftPanel";

const GlavnaStr = () => {
  return (
    <div className="container">
      <div className="left-panel"><LeftPanel /> </div>
      <div className="main-content">Sredina</div>
      <div className="right-panel">Desni Panel</div>
    </div>
  );
};

export default GlavnaStr;