import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  Button,
  CircularProgress,
  Box,
  Typography,
  IconButton,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const GifSelector = ({ open, onClose, onSelectGif }) => {
    
  const [loading, setLoading] = useState(false);
  const [gifs, setGifs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('funny');
  const [error, setError] = useState(null);

  // Funkcija za dohvatanje GIF-ova sa Giphy API-ja
  const fetchGifs = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const GIPHY_API_KEY = 'bZ7zRKaeDFTCJQUisDOpcdUixVkoGvdf'; 
      
      const response = await axios.get('https://api.giphy.com/v1/gifs/search', {
        params: {
          api_key: GIPHY_API_KEY,
          q: query,
          limit: 16,
          rating: 'g'
        }
      });
      
      setGifs(response.data.data);
    } catch (err) {
      console.error('Greška pri dohvatanju GIF-ova:', err);
      setError('Došlo je do greške pri učitavanju GIF-ova. Molimo pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  // Učitaj GIF-ove kada se otvori dialog ili promeni pretraga
  useEffect(() => {
    if (open && searchQuery) {
      fetchGifs(searchQuery);
    }
  }, [open]);

  // Funkcija za odabir GIF-a
  const handleSelectGif = (gifUrl) => {
    onSelectGif(gifUrl);
    onClose();
  };

  

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGifs(searchQuery);
  };

  return (
    <Dialog open={open} onClose={onClose}
      PaperProps={{ 
        style: { 
          width: '800px',  
          maxWidth: '90vw', 
        } 
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
        <DialogTitle style={{ padding: 0, fontWeight: 500 }}>Odaberite GIF za chat</DialogTitle>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            size='small' 
            onClick={onClose}
            style={{ textTransform: 'none' }}
          >
            Otkaži
          </Button>
       
        </div>
      </div>
      <DialogContent>
        <form onSubmit={handleSearch}>
          <TextField
            fullWidth
            margin="normal"
            label="Pretraži GIF-ove"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit" edge="end">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
    
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
              onClick={() => fetchGifs(searchQuery)} 
              sx={{ mt: 2 }}
            >
              Pokušaj ponovo
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {gifs.map((gif) => (
              <Grid item xs={6} sm={4} md={3} key={gif.id}>
                <Box
                  component="img"
                  src={gif.images.fixed_height.url}
                  alt={gif.title || 'Giphy GIF'}
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
                  onClick={() => handleSelectGif(gif.images.original.url)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GifSelector;