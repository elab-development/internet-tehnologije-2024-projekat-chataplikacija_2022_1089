import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React, {useState, useEffect, useCallback} from 'react'
import axios from 'axios';
import '../styles/HopInGroup.css';

function HopInGroup({userId, onGroupSelect}) {
const [allGroups, setAllGroups] = useState([]);
const [loading, setLoading] = useState(true);
const [selectedGroup, setSelectedGroup] = useState('');
const [userGroups, setUserGroups] = useState([]);
const [availableGroups, setAvailableGroups] = useState([]);

const fetchAllGroups = async () => {
    try {
    const response = await axios.get('/api/groups');
    setAllGroups(response.data.groups);
    setLoading(false);
    } catch (error) {
    console.error('Greška pri dohvatanju grupa:', error);
    setLoading(false);
    }
};
const handleOpenSelect = () => {
    // Osvežavanje obe liste svaki put kada se otvori select
    fetchAllGroups()
    fetchUserGroups()
  }


const handleGroupChange = (event) => {
    const selectedGroupId = event.target.value;
    setSelectedGroup(event.target.value);
    if (onGroupSelect) {
        onGroupSelect(selectedGroupId);
      }
};



  useEffect(() => {
    fetchAllGroups();
  }, []);

  

 // Dohvatanje grupa u kojima se korisnik nalazi
 
    const fetchUserGroups = useCallback( async () => {
    if (userId) {
        try {
          const response = await axios.get(`/api/groups/${userId}/groups`);
          setUserGroups(response.data.groups);
        } catch (error) {
          console.error('Greška pri dohvatanju grupa usera:fetchUserGroups', error);
        }
      }else{
        setUserGroups([]);
      }
    }, [userId]);


  useEffect(() => {
    fetchUserGroups();
  }, [fetchUserGroups]);

  useEffect(() => {
      if (allGroups.length > 0 && userGroups.length >= 0) {
        const userGroupsIds = new Set(userGroups.map(group => group.id));
        const filteredGroups = allGroups.filter(group => !userGroupsIds.has(group.id));
        
        setAvailableGroups(filteredGroups);
        
        if (selectedGroup && !filteredGroups.some(group => group.id.toString() === selectedGroup)) {
            setSelectedGroup('');
            if (onGroupSelect) {
              onGroupSelect(null);
            }
          }

      }
    }, [allGroups, userGroups, selectedGroup, onGroupSelect]);
    
  if (loading) {
    return <div>Učitavanje grupa...</div>;
  }

  return (
    <FormControl fullWidth>
    <InputLabel id="demo-simple-select-label">Pridružite se grupi</InputLabel>
    <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={selectedGroup}
        label="Dostupne grupe"
        onChange={handleGroupChange}
        onOpen={handleOpenSelect}
        renderValue={(selectedId) => {
            const selectedGroup = allGroups.find(group => group.id.toString() === selectedId)
            return selectedGroup ? selectedGroup.name : ''
          }}
          sx={{
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              fontFamily:'Inter, sans-serif;'
            }
          }}
         
        
    >
       {availableGroups.map((group) => (
            <MenuItem className='menu-item'
                key={group.id}
                value={group.id.toString()}
            >
                <h3>{group.name}</h3>
                 <p>{group.is_private === 1 ? '(privatna grupa)' : '(javna grupa)'}</p>
                 <p>{'Opis: '}{group.description}</p>
            </MenuItem>
            ))}
    </Select>
    </FormControl>
  )
}

export default HopInGroup