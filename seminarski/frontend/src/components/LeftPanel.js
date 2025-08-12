import React, {useState, useEffect, useCallback} from 'react';
import '../styles/LeftPanel.css';
import { Button, Tooltip } from '@mui/material';
import axios from 'axios';
import CreateGroupDialog from './CreateGroupDialog';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import GroupsIcon from '@mui/icons-material/Groups';
import HopInGroup from './HopInGroup';


    

    const LeftPanel = ({ onGroupSelect, onLeaveGroup, currentUser}) => {
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
          setError({});
        };
       
        const [error, setError] = useState({});
        const [groups, setGroups] = useState([]);
        const [activeGroup, setActiveGroup] = useState(null);
        const [displayedGroups, setDisplayedGroups] = useState([]);
        const [currentPage, setCurrentPage] = useState(1);
        const [totalPages, setTotalPages] = useState(1);
        const [selectedGroupId, setSelectedGroupId] = useState(null);
        // eslint-disable-next-line no-unused-vars
        const [resetGroupSelection, setResetGroupSelection] = useState(null);
        const groupsPerPage = 4;
        
        
      //const userDataString = localStorage.getItem('ulogovani_user');
        //let userId = null;
        //const userData = JSON.parse(userDataString);
        //userId = userData.id; 
        //console.log('Stored user ID:', userId);
        

        const handleAddGroup = async  (formData) => {
          const checkResponse = await axios.get('/api/check-group-name', {
            params: { name: formData.name }
          });
          
          if (checkResponse.data.exists) {
            setError({ name: 'Grupa sa tim imenom već postoji u bazi!' });
            return;
          }
          let userIdd = currentUser?.id;
          

            try {
              const response= await axios.post(`/api/add-group/${userIdd}`,{
              
                  name: formData.name,
                  description: formData.description,
                  is_private: formData.is_private,
              });
      
              console.log('Uspesno dodata soba:', response.data);
              

              myGroups();

              setGroupData({
                name: '',
                description: '',
                is_private: 1
               });
               setError({});

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

       
  
        const handleUserSelect = (groupId) => {
          setSelectedGroupId(groupId);
        };

        const handleJoinGroup = async()=>{
            if (!selectedGroupId) {
              return;
            }
            let userIdd = currentUser?.id;
            try {
               await axios.post(`/api/groups/${selectedGroupId}/usersadd`, {
                user_ids: [userIdd]
              });
          
              
              myGroups(); // Funkcija za osvežavanje liste grupa
              
              // Resetovanje selektovane grupe
              setSelectedGroupId(null);
             
            
          
            } catch (error) {
              console.error('Greška pri pridruživanju grupi:', error);
            }
  
        }
        

        const userIddd = currentUser?.id;
        const myGroups = useCallback( async()=>{
        
         try {
            let response;
    
            
            if (currentUser?.role === 'admin') {
              response = await axios.get('/api/groupsAdm'); 
            } else {
              
              response = await axios.get(`/api/groups/${userIddd}/groups`);
            }
            
            const myGroupsData = response.data.groups;
            setGroups(myGroupsData);
            setTotalPages(Math.ceil(myGroupsData.length / groupsPerPage));
            updateDisplayedGroups(myGroupsData, currentPage);
          } catch (error) {
            console.error("Greška pri dohvatanju grupa:", error);
          }

        }, [currentPage, groupsPerPage, userIddd, currentUser/* onLeaveGroup*/]);

        

        const updateDisplayedGroups = (myGroups, page) => {
          const startIndex = (page - 1) * groupsPerPage;
          const endIndex = startIndex + groupsPerPage;
          setDisplayedGroups(myGroups.slice(startIndex, endIndex));
        };
      
          // Funkcije za navigaciju kroz stranice
          const goToNextPage = () => {
            if (currentPage < totalPages) {
              const nextPage = currentPage + 1;
              setCurrentPage(nextPage);
              updateDisplayedGroups(groups, nextPage);
            }
          };
      
          const goToPreviousPage = () => {
            if (currentPage > 1) {
              const prevPage = currentPage - 1;
              setCurrentPage(prevPage);
              updateDisplayedGroups(groups, prevPage);
            }
          };

          useEffect(() => {
            if(onLeaveGroup===true){
              myGroups();
            }
            myGroups(); 
          }, [myGroups, onLeaveGroup]); 

          useEffect(() => {
            updateDisplayedGroups(groups, currentPage);
          }, [currentPage, groups]);
      

        const handleGroupClick = (groupId) => {
          setActiveGroup(groupId);
          onGroupSelect(groupId);
        };
       
    
      return (
        <div className="groups-panel">
          
              <Button 
              className='add-button'
              variant="contained" 
              color="primary" 
              onClick={handleOpenDialog}
              size='small'
              >
              Dodaj novu grupu
              </Button>
        {currentUser && (
          <CreateGroupDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onSubmit={handleAddGroup}
          error={error}
          role={currentUser.role} 
        />
        )}
        {currentUser && currentUser.role !== 'admin' && (
        <div className="group-controls-container">
            <div style={{flex:1, maxWidth:"75%"}}>
              {currentUser && (
                
                <HopInGroup
                userId={currentUser?.id}
                onGroupSelect={handleUserSelect}
                onReset={setResetGroupSelection}
                currentUser={currentUser}
              />
      
              )}
              </div>

            {currentUser && (
            <Tooltip title="Pridruži se grupi" arrow>
            
              <Button
              className='hop-in-group-button'
              variant="contained"
              onClick={handleJoinGroup}
              size='small'
              
            >
              <GroupsIcon/>
            </Button>
            </Tooltip> 
          )}
          </div>)}

          <div className="groups_card">
            <span className="list_header">{currentUser?.role === 'admin' ? 'Sve grupe' : 'Moje grupe'}</span>
            <div className="groups-list">
              {displayedGroups.map((group) => (
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
            
            <div className="pagination-controls">
              <Tooltip title="Prethodna stranica" arrow>
                <span>
              <Button 
                onClick={goToPreviousPage} 
                disabled={currentPage === 1}
                variant="contained"
                size="small"
                className="pagination-button"
                style={{ backgroundColor: currentPage === 1 ? '' : '#456db4' }}
              >
                <NavigateBeforeIcon />
              </Button>
              </span>
              </Tooltip>

              <span className="page-indicator">
                {currentPage} / {totalPages}
              </span>

              <Tooltip title="Sledeća stranica" arrow >
                <span>
              <Button 
                onClick={goToNextPage} 
                disabled={currentPage === totalPages || totalPages === 0}
                variant="contained"
                size="small"
                className="pagination-button"
                style={{ backgroundColor: currentPage === totalPages || totalPages === 0 ? '' : '#456db4' }}
    
              >
                <NavigateNextIcon />
              </Button>
              </span>
              </Tooltip>
            </div>
           
          </div>
        </div>
      );
    };
  
    export default LeftPanel;