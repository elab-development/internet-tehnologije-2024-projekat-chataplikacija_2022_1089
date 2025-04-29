import React from "react";
import "../styles/UserCard.css";

const UserCard = () => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!user) {
        return <p>Nema prijavljenog korisnika.</p>;
    }

    return (
        <div className="user-card-container">
            <div className="images-container">
                <img src="images/avatar-profile-icon1.jpg" alt="Left" className="left-image" />
            </div>
            <div className="user-card">
                <h3>Korisnički profil</h3>
                <p><strong>Ime:</strong> {user.name}</p>
                <p><strong>📧Email:</strong> {user.email}</p>
            </div>
            <div className="images-container">
                <img src="images/avatar-profile-icon2.jpg" alt="Right" className="right-image" />
            </div>
        </div>
    );
};

export default UserCard;