import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/NavBar.css";
import { CgProfile } from "react-icons/cg";
import { MdOutlineMarkUnreadChatAlt, MdOutlineGroups, MdLogout } from "react-icons/md";

const Navbar = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login"); 
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/chatrooms">
            <MdOutlineMarkUnreadChatAlt size={24} />
            <span>Chat Sobe</span>
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <CgProfile size={24} />
            <span>Moj profil</span>
          </Link>
        </li>
        <li>
          <Link to="/create-group">
            <MdOutlineGroups size={24} />
            <span>Kreiraj grupu</span>
          </Link>
        </li>
        <li>
          <button onClick={handleLogout} className="logout-btn">
            <MdLogout size={24} />
            <span>Odjavi se</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
