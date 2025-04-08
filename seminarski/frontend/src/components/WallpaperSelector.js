import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/WallpaperSelector.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';

const WallpaperSelector = ({ open, onClose, onSelectWallpaper, onDeleteWallpaper }) => {

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('nature');
  const [error, setError] = useState(null);

  
  const themes = [
    { value: 'nature', label: 'Priroda' },
    { value: 'sea beach', label: 'More i plaže' },
    { value: 'mountains', label: 'Planine' },
    { value: 'abastract art', label: 'Apstraktni oblici' },
    { value: 'minimalist', label: 'Minimalizam' },
    { value: 'cute animals', label: 'Životinjice' },
    { value: 'space universe', label: 'Svemir' },
    { value: 'geometric shapes', label: 'Geometrijski oblici' },
    { value: 'quotes', label: 'Citati' },
    { value: 'nude colors', label: 'Boje' },
  ];

  // Funkcija za dohvatanje slika sa Unsplash API-ja
  
  const fetchImages = async (query) => {
    setLoading(true);
    setError(null);
    
    try {
      
      const UNSPLASH_ACCESS_KEY = 'mRXlG4Wj2916oJm8RRfdXw50fkeYSDn0cDL69JMneb4';
      
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query: query,
          per_page: 16,
          orientation: 'landscape'
        },
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      });
      
      setImages(response.data.results);
    } catch (err) {
      console.error('Greška pri dohvatanju slika:', err);
      setError('Došlo je do greške pri učitavanju slika. Molimo pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };
  

  // Učitaj slike kada se promeni tema
  useEffect(() => {
    
  if (open && selectedTheme) {
    
    fetchImages(selectedTheme);
  }
  }, [selectedTheme, open]);

  // Funkcija za odabir slike kao pozadine
  const handleSelectImage = (imageUrl) => {
    onSelectWallpaper(imageUrl);
    onClose();
  };

  const toggleDeleteWallpaper = () => {
    onDeleteWallpaper();
    onClose();

  }
  


  return (
    <Dialog open={open} onClose={onClose}  
    PaperProps={{ 
        style: { 
          width: '800px',  
          maxWidth: '90vw', 
          
        } 
      }} >
    <div className='wallpaper-header'>
      <DialogTitle fontWeight={500}>Odaberite pozadinu za chat</DialogTitle>
      <div className='buttons-wallpaper'>
        <Button className='button-otkazi' size='small' onClick={onClose}>Otkazi</Button>
        <Button className='button-obrisi' size='small'onClick={() => toggleDeleteWallpaper()}>Obrisi pozadinu</Button>
      </div>
   </div>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel id="theme-select-label">Tema</InputLabel>
          <Select
            labelId="theme-select-label"
            value={selectedTheme}
            label="Tema"
            onChange={(e) => setSelectedTheme(e.target.value)}
          >
            {themes.map((theme) => (
              <MenuItem key={theme.value} value={theme.value}>{theme.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
    
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box textAlign="center" my={4}>
            <Typography color="error">{error}</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => fetchImages(selectedTheme)} 
              sx={{ mt: 2 }}
            >
              Pokušaj ponovo
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            
            {images.map((image) => (
              <Grid item xs={4} sm={3} key={image.id}>
                <Box
                  component="img"
                  src={image.urls.small}
                  alt={image.alt_description || 'Unsplash slika'}
                  sx={{
                    width: '100%',
                    height: 120,
                    objectFit: 'cover',
                    borderRadius: 1,
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 3
                    }
                  }}
                  onClick={() => handleSelectImage(image.urls.regular)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
 

};


export default WallpaperSelector;