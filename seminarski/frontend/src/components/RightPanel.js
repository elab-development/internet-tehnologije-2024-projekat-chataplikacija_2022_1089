import React,{useState, useEffect} from 'react'
import { useNavigate  } from 'react-router-dom';
import { Button } from '@mui/material';
import axios from 'axios';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import '../styles/RightPanel.css';
import logo from '../user.png'
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import MultipleSelectUsers from './MultipleSelectUsers';

const RightPanel = ({ selectedGroupId }) => {
    
    const [groupUsers, setGroupUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
      if (selectedGroupId) {
        fetchGroupUsers(selectedGroupId);
        console.log(selectedGroupId)
      } else {
        setGroupUsers([]);
      }
    }, [selectedGroupId]);

    
    
    const fetchGroupUsers = async (groupId) => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/groups/${groupId}/users`);
        setGroupUsers(response.data.users);
      } catch (error) {
        console.error("Greška pri dohvatanju korisnika grupe:", error);
      } finally {
        setLoading(false);
      }
    };

    const handleUserSelect = (selectedUserIds) => {
      
      //cuva odabrane id-jeve
      setSelectedUserIds(selectedUserIds);
    };
    

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("ulogovani_user"));

    const handleLogout = async(e)=>{
        
        try {
            
            const token = localStorage.getItem('token_ulogovanog');
            
            if (token) {
              axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              
              
              await axios.post('api/logout');
              
              console.log("Korisnik uspešno odjavljen");
            }
          } catch (error) {
            console.error("Greška prilikom odjavljivanja:", error);
          } finally {
            // čistimo lokalno skladište i header
            localStorage.removeItem('token_ulogovanog');
            localStorage.removeItem('ulogovani_user');
            
            // Uklanjamo Authorization header
            delete axios.defaults.headers.common['Authorization'];
            navigate('/'); 
          }
          
    }
    const handleAddUserInGroup = async(e)=>{
            e.preventDefault();
            if (!selectedGroupId || selectedUserIds.length === 0) {
              console.log("Nije odabrana grupa ili nisu odabrani korisnici");
              return;
            }
            
            try {
            
              await axios.post(`/api/groups/${selectedGroupId}/usersadd`, {
                user_ids: selectedUserIds
              });
              
              // Nakon uspešnog dodavanja, osvežavanje listu korisnika u grupi
              fetchGroupUsers(selectedGroupId);

              setSelectedUserIds([]);
              setRefreshTrigger(prev => prev + 1);
              
            } catch (error) {
              
              console.error("Greška pri dodavanju korisnika u grupu:", error);
              alert("Došlo je do greške prilikom dodavanja korisnika u grupu(handle add group).");
            }

    }


  return (
    <div className='right-panel'>
        <div className='right-groups-panel'>
            <div className='header-right-panel'>
            <Button 
                className='logout-button'
                variant="contained" 
                onClick={handleLogout}
                size='small'
            >
            <ExitToAppIcon/>
            </Button>
            </div>
            <div className='logged-user-card'>
                <div className='user-info'>
                    <h3>Korisnički profil</h3>
                    <p><strong>Ime:</strong> {user.username}</p>
                    <p><strong>📧Email:</strong> {user.email}</p>
                </div>  
                <div className='user-img'>
                <img src={logo} alt="User Logo" style={{ width: "70px", height: "70px",
                   borderRadius: "40px", objectFit: "cover", marginLeft: "5px" }} />
                </div>
            </div>
            <div className='users-container'>
            <div className='users-header'>
            <h2>Korisnici grupe {selectedGroupId}</h2>
                </div>
                  
                {selectedGroupId ? (
                  <>
                    <div className="user-controls-container">
                      <div style={{flex:1}}>
                      <MultipleSelectUsers
                        selectedGroupId={selectedGroupId}
                        onUserSelect={handleUserSelect}
                        selectedUserIds={selectedUserIds}
                        refreshTrigger={refreshTrigger}
                      />
                      </div>
                      <Button
                        className='add-user-button'
                        variant="contained"
                        onClick={handleAddUserInGroup}
                        size='small'
                      >
                        <PersonAddAltRoundedIcon/>
                      </Button>
                    </div>
                    
                    {loading ? (
                      <div>Učitavanje korisnika...</div>
                    ) : (
                      <div className="users-list">
                        {groupUsers.length > 0 ? (
                          groupUsers.map(user => (
                            <div key={user.id} className="user-item">
                              <div className="user-details">
                                <h4>{user.username}</h4>
                                <p>{user.email}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>Nema korisnika u ovoj grupi ili nijedna grupa nije odabrana</p>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <p>Izaberite grupu da biste videli i upravljali korisnicima</p>
                )}
              </div>

                    

        </div>
    </div>
  )
}

export default RightPanel