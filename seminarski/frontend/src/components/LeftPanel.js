import React, {useState, useEffect} from 'react';
import '../styles/LeftPanel.css';
import { Button } from '@mui/material';
import axios from 'axios';
import CreateGroupDialog from './CreateGroupDialog';
    
    

    const LeftPanel = () => {
      // eslint-disable-next-line no-unused-vars
      const [groupData, setGroupData] = useState({
          name: "",
          description:"",
          is_private: 1,//difoltno je privatna
        });
        const [openDialog, setOpenDialog] = useState(false);

        const handleOpenDialog = () => {
          setOpenDialog(true);
        };
      
        const handleCloseDialog = () => {
          setOpenDialog(false);
        };
        // eslint-disable-next-line no-unused-vars
        const [error, setError] = useState({});
        const [groups, setGroups] = useState([]);
        const [activeGroup, setActiveGroup] = useState(null);

        const handleAddGroup = async  (formData) => {
            
            try {

              const response = await axios.post('api/add-group', {
                  name: formData.name,
                  description: formData.description,
                  is_private: formData.is_private,
              });
      
              console.log('Uspesno dodata soba:', response.data);
              

              allGroups();

              setGroupData({
                name: '',
                description: '',
                is_private: 1
               });

               handleCloseDialog();

              } catch (error) {
                if (error.response && error.response.status === 422) {
                  console.log('Validation Errors:', error.response.data.errors);
                  setError(error.response.data.errors);
              } else {
                  console.error('Greška:', error);
                  setError({ 
                      general: error.response?.data?.message || 'Došlo je do greške' 
                  });
              }
            }
        };

        const allGroups = async () => {
          try {
              const response = await axios.get('/api/groups'); 
              setGroups(response.data.groups);
          } catch (error) {
              console.error("Greška pri dohvatanju grupa:", error);
                  
            }
          };

          const handleGroupClick = (groupId) => {
            setActiveGroup(groupId);
          };
        useEffect(() => { allGroups();}, []); 
    
      return (
        <div className="groups-panel">
          <div className="groups-header">
            <h2>Dostupne grupe</h2>
          </div>
              <Button 
              className='add-button'
              variant="contained" 
              color="primary" 
              onClick={handleOpenDialog}
              size='small'
              >
              Dodaj novu grupu
        </Button>

        <CreateGroupDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onSubmit={handleAddGroup}
        />


          
          
          <div className="groups_card">
            <span className="list_header">Moje grupe</span>
            <div className="groups-list">
              {groups.map((group) => (
                  <div 
                  key={group.id} 
                  className={`group-item ${activeGroup === group.id ? 'active' : ''}`}
                  onClick={() => handleGroupClick(group.id)}
                >
                  <div 
                    className="group-icon" 
                    style={{
                      backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                    }}
                  >
                    {group.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="group-details">
                    <h3>{group.name}</h3>
                    <p>{group.is_private === 1 ? '(privatna grupa)' : '(javna grupa)'}</p>
                    <p>{'Opis: '}{group.description}</p>
                  </div>
                </div>
              ))}
            
            </div>
          </div>
        </div>
      );
    };
  
    export default LeftPanel;