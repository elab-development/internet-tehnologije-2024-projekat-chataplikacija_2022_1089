import React, { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, 
    Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

    const CreateGroupDialog = ({ open, onClose, onSubmit, error }) => {
        const [groupData, setGroupData] = useState({
          name: "",
          description: "",
          is_private: 1
        });
      
        const handleInput = (e) => {
          setGroupData({
            ...groupData,
            [e.target.name]: e.target.value,
          });
        };
      
        const handlePrivacyChange = (event) => {
          const privacyValue = event.target.value === 'private' ? 1 : 0;
          setGroupData({
            ...groupData,
            is_private: privacyValue
          });
        };
      
        const handleSubmit = () => {
           
            onSubmit(groupData);
          
        };
      
        return (
          <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Napravite novu grupu</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Ime grupe"
                type="text"
                fullWidth
                variant="outlined"
                error={!!error.name} // Postavi crvenu ivicu ako postoji greška
                helperText={error.name} 
                value={groupData.name}
                onChange={handleInput}
                required
                sx={{ mb: 2, mt: 1 }}
              />
              <TextField
                margin="dense"
                name="description"
                label="Unesite opis grupe"
                type="text"
                fullWidth
                variant="outlined"
                value={groupData.description}
                onChange={handleInput}
                sx={{ mb: 2 }}
              />
              {error.general && <p style={{ color: 'red' }}>{error.general}</p>}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="privacy-select-label">Privatnost grupe</InputLabel>
                <Select
                  labelId="privacy-select-label"
                  id="privacy-select"
                  value={groupData.is_private === 1 ? 'private' : 'public'}
                  label="Privatnost grupe"
                  onChange={handlePrivacyChange}
                >
                  <MenuItem value="private">Privatna</MenuItem>
                  <MenuItem value="public">Javna</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Otkaži</Button>
              <Button onClick={handleSubmit} variant="contained">Kreiraj</Button>
            </DialogActions>
          </Dialog>
        );
      };
      
      export default CreateGroupDialog;