import React, {useState, useEffect, useCallback} from 'react';
import '../styles/LeftPanel.css';
import { Button } from '@mui/material';
import axios from 'axios';
import CreateGroupDialog from './CreateGroupDialog';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
    
    

    const LeftPanel = ({ onGroupSelect }) => {
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
        // eslint-disable-next-line no-unused-vars
        const [error, setError] = useState({});
        const [groups, setGroups] = useState([]);
        const [activeGroup, setActiveGroup] = useState(null);
        const [displayedGroups, setDisplayedGroups] = useState([]);
        const [currentPage, setCurrentPage] = useState(1);
        const [totalPages, setTotalPages] = useState(1);
        const groupsPerPage = 5;

        const handleAddGroup = async  (formData) => {

          const groupExists = groups.some(group => group.name.toLowerCase() === formData.name.toLowerCase());

          if (groupExists) {
              setError({ name: 'Grupa sa tim imenom već postoji!' });
              return; 
          }
            
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

        const allGroups = useCallback( async () => {
          try {
              const response = await axios.get('/api/groups'); 
              const allGroups = response.data.groups;
              setGroups(allGroups);
              setTotalPages(Math.ceil(allGroups.length / groupsPerPage));
              updateDisplayedGroups(allGroups, currentPage);
          } catch (error) {
              console.error("Greška pri dohvatanju grupa:", error);
                  
            }
          },[currentPage, groupsPerPage]);

          const updateDisplayedGroups = (allGroups, page) => {
            const startIndex = (page - 1) * groupsPerPage;
            const endIndex = startIndex + groupsPerPage;
            setDisplayedGroups(allGroups.slice(startIndex, endIndex));
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
            updateDisplayedGroups(groups, currentPage);
          }, [currentPage, groups]);
      

        const handleGroupClick = (groupId) => {
          setActiveGroup(groupId);
          onGroupSelect(groupId);
        };
        useEffect(() => { 
          allGroups();
        }, [allGroups]); 
    
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
          error={error}
        />

          <div className="groups_card">
            <span className="list_header">Moje grupe</span>
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
              <span className="page-indicator">
                {currentPage} / {totalPages}
              </span>
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
            </div>
          </div>
        </div>
      );
    };
  
    export default LeftPanel;