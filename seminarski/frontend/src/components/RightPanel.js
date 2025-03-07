import React,{useState, useEffect} from 'react'
import { useNavigate  } from 'react-router-dom';
import { Button } from '@mui/material';
import axios from 'axios';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import '../styles/RightPanel.css';
import logo from '../user.png'
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';

const RightPanel = ({ selectedGroupId }) => {
    
    const [groupUsers, setGroupUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (selectedGroupId) {
        //fetchGroupUsers(selectedGroupId);
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
            e.preventDifolt();
            //imam grupu, njen id

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
              <Button 
                className='add-user-button'
                variant="contained" 
                onClick={handleAddUserInGroup}
                size='small'
               >
               Dodajte novog korisnika<PersonAddAltRoundedIcon/>
               </Button>
                <div className="users-list">
                  {groupUsers.length > 0 ? (
                    groupUsers.map(user => (
                      <div key={user.id} className="user-item">
                        <div 
                          className="user-avatar"
                          style={{
                            backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                          }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details">
                          <h4>{user.name}</h4>
                          <p>{user.email}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Nema korisnika u ovoj grupi ili nijedna grupa nije odabrana</p>
                  )}
                </div>
              </div>

                    

        </div>
    </div>
  )
}

export default RightPanel