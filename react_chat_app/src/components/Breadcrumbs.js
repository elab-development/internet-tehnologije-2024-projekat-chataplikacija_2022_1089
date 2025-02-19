import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const routeNames = {
  "chatrooms": "Lista chat grupa",
  "create-group": "Kreiranje/brisanje sobe",
  "profile": "Moj profil",
  "welcomePage": " ",
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    // Ako je ruta "/chatrooms/:id", pronađi ime sobe
    if (pathnames[0] === "chatrooms" && pathnames.length > 1) {
      const roomId = pathnames[1]; 
      const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
      const room = rooms.find((r) => r.id.toString() === roomId);
      
      if (room) {
        setRoomName(room.name);
      } else {
        setRoomName("Nepoznata soba");
      }
    }
  }, [pathnames]);

  return (
    <nav className="breadcrumbs">
      <Link to="/welcomePage">Početna</Link>
      {pathnames.map((value, index) => {
        let label = routeNames[value] || decodeURIComponent(value);
        const pathTo = `/${pathnames.slice(0, index + 1).join('/')}`;

        // Ako je ruta /chatrooms/:id, koristi naziv sobe umesto ID-ja
        if (pathnames[0] === "chatrooms" && index === 1) {
          label = roomName;
        }

        return (
          <span key={index}>
            {' >>> '}
            <Link to={pathTo}>{label}</Link>
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
