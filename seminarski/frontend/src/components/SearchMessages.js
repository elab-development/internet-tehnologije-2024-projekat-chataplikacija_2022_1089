import * as React from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

function SearchMessages({ messages, onSearchResults }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
      const term = e.target.value;
      setSearchTerm(term);
  
      if (term.trim() === '') {
        onSearchResults(null);
        return;
      }
      const filteredMessages = messages.filter(msg => 
        msg.content.toLowerCase().includes(term.toLowerCase())
      );
      onSearchResults(filteredMessages);
    };


  return (
     <Box
      component="form"
      sx={{ '& > :not(style)': {  width: '12ch',
        '& .MuiInputBase-root': {
            fontSize: '0.6rem', 
        },
        '& .MuiInputLabel-root': {
            fontSize: '0.7rem', // labela
        }
      }
    }}
      noValidate
      autoComplete="off"
    >
      <TextField id="standard-basic" label="Pretrazite..." variant="standard" size='small' 
      value={searchTerm} onChange={handleSearchChange} />
    </Box>
  )
}

export default SearchMessages