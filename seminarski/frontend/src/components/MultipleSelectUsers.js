import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, selectedUsers, theme) {
  return {
    fontWeight: selectedUsers.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function MultipleSelectUsers({ selectedGroupId, onUserSelect, selectedUserIds = [], refreshTrigger = 0 }) {
  const theme = useTheme();
  const [allUsers, setAllUsers] = useState([]);
  const [groupUsers, setGroupUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dohvatanje svih korisnika
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        setAllUsers(response.data.users);
        setLoading(false);
      } catch (error) {
        console.error('Greška pri dohvatanju korisnika:', error);
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  // Dohvatanje korisnika koji su već u grupi
  useEffect(() => {
    if (selectedGroupId) {
      const fetchGroupUsers = async () => {
        try {
          const response = await axios.get(`/api/groups/${selectedGroupId}/users`);
          // Pretpostavljamo da response.data.users sadrži niz korisnika sa id i name
          //const userIds = response.data.users.map(user => user.id.toString());
          setGroupUsers(response.data.users);
          //setSelectedUsers(userIds);
        } catch (error) {
          console.error('Greška pri dohvatanju korisnika(fja za one koji su vec u grui):', error);
        }
      };

      fetchGroupUsers();
    } else {
      setGroupUsers([]);
    }
  }, [selectedGroupId, refreshTrigger]);

  useEffect(() => {
    if (allUsers.length > 0 && groupUsers.length >= 0) {
      // Kreiranje skupa ID-jeva korisnika koji su već u grupi
      const groupUserIds = new Set(groupUsers.map(user => user.id));
      
      // Filtriranje korisnika koji nisu u grupi
      const filteredUsers = allUsers.filter(user => !groupUserIds.has(user.id));
      
      setAvailableUsers(filteredUsers);
    }
  }, [allUsers, groupUsers]);

  const handleChange = (event) => {
    const { value } = event.target;
    
    // Pretvaramo u niz ako je string
    const selectedValues = typeof value === 'string' ? value.split(',') : value;
    
    
    
    // Obaveštavamo roditelja o promeni
    if (onUserSelect) {
      onUserSelect(selectedValues);
    }
  };

  

  if (loading) {
    return <div>Učitavanje korisnika...</div>;
  }

  return (
    
      <FormControl sx={{ width: '100%', maxWidth:"100%" }}>
        <InputLabel id="multiple-user-select-label">Korisnici</InputLabel>
        <Select
          labelId="multiple-user-select-label"
          id="multiple-user-select"
          multiple
          value={selectedUserIds}
          onChange={handleChange}
          input={<OutlinedInput label="Dodajte KORISNIKE" />}
          MenuProps={MenuProps}
        >
          {availableUsers.map((user) => (
            <MenuItem
              key={user.id}
              value={user.id.toString()}
              style={getStyles(user.id.toString(), selectedUserIds, theme)}
            >
              {user.username}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    
  );
}