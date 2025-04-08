import React,{useState, useEffect} from 'react'
import { useNavigate  } from 'react-router-dom';
import { Button, Tooltip} from '@mui/material';
import axios from 'axios';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import '../styles/RightPanel.css';
import logo from '../user.png'
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import MultipleSelectUsers from './MultipleSelectUsers';
import { FaRegUserCircle } from "react-icons/fa";
import { useAlertDialog } from './AlertDialogContext';


const RightPanel = ({ selectedGroupId, onStatisticsClick }) => {
    
    const [groupUsers, setGroupUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { showConfirmDialog } = useAlertDialog();

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
    
    const [groupName, setGroupName] = useState("");
    
    useEffect(() => {
    const fetchGroupName = async () => {
          try {
              const response = await axios.get('/api/groups'); 
              const foundGroup = response.data.groups.find(group => group.id === selectedGroupId);
              setGroupName(foundGroup?.name || "(Izaberite grupu)");
          } catch (error) {
              console.error("Greška pri dohvatanju imena grupe:", error);
              setGroupName("(Izaberite grupu)");
            }
          };


       fetchGroupName();
    }, [selectedGroupId]);

    const handleLogout = async(e)=>{
        
        try {
          const confirmed = await showConfirmDialog(
            "Potvrda logout-a", 
            "Da li ste sigurni da želite da izadjete iz aplikacije?"
          );
          
          
          if (!confirmed) {
            return;
          }
            
            const token = localStorage.getItem('token_ulogovanog');
            
            if (token) {
              axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              
              
              await axios.post('api/logout');
              
              console.log("Korisnik uspešno odjavljen");
            }

            localStorage.removeItem('token_ulogovanog');
            localStorage.removeItem('ulogovani_user');
            delete axios.defaults.headers.common['Authorization'];
            navigate('/');

          } catch (error) {
            console.error("Greška prilikom odjavljivanja:", error);
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
    
    <div className='right-groups-panel'>
      
      <div className='right-panel-fixed-content'>
        <div className='header-right-panel'>
        <Tooltip title="Prikaz statistike" arrow>
        <Button
            className='statistic-button'
            variant="contained"
            onClick={onStatisticsClick}
            size='small'
          >
            <AssessmentIcon />
          </Button>
        </Tooltip>
       

        <Tooltip title="Odjavi se" arrow>
          <Button
            className='logout-button'
            variant="contained"
            onClick={handleLogout}
            size='small'
          >
            <ExitToAppIcon/>
          </Button>
          </Tooltip>
        </div>
        
        <div className='logged-user-card'>
          <div className='user-info'>
            <h3>Korisnički profil</h3>
            <p><strong></strong> {user.username}</p>
            {
            user.role === 'user' && (
              <p><strong>📧Email:</strong> {user.email}</p>
            )
          }
           
          </div>
          <div className='user-img'>
            <img src={logo} alt="User Logo" style={{ width: "70px", height: "70px", 
              borderRadius: "40px", objectFit: "cover", marginLeft: "5px" }} />
          </div>
        </div>
        
        
        
        {selectedGroupId && (
          <div className="user-controls-container">
            <div style={{flex:1, maxWidth:"75%"}}>
              <MultipleSelectUsers
                selectedGroupId={selectedGroupId}
                userId={user.id}
                onUserSelect={handleUserSelect}
                selectedUserIds={selectedUserIds}
                refreshTrigger={refreshTrigger}
              />
            </div>
            <Tooltip title={`Dodaj korisnika/e u ${groupName}`} arrow>
            <Button
              className='add-user-button'
              variant="contained"
              onClick={handleAddUserInGroup}
              size='small'
            >
              <PersonAddAltRoundedIcon/>
            </Button>
            </Tooltip>
          </div>
        )}
        <div className='users-header'>
          <h2>Korisnici grupe "{groupName}"</h2>
        </div>
      </div>
      
      {selectedGroupId ? (
        loading ? (
          <div>Učitavanje korisnika...</div>
        ) : (
          <div className="users-list">
            <div className='users-list-header'>
              <p>Broj članova: {groupUsers.length} </p>
            </div>
            {groupUsers.length > 0 ? (
              groupUsers.map(user => (
                <div key={user.id} className="user-item">
                  <div className="user-details">
                    <FaRegUserCircle size={35} />
                    <h4>{user.username}</h4>
                  </div>
                </div>
              ))
            ) : (
              <p>Nema korisnika u ovoj grupi</p>
            )}
          </div>
        )
      ) : (
        <div className="users-list">
          <p>Izaberite grupu da biste videli i upravljali korisnicima</p>
        </div>
      )}
    </div>
  
);
}

export default RightPanel