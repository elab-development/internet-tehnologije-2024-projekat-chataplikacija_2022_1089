import React, { createContext, useState, useContext } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


const AlertDialogContext = createContext();


export const AlertDialogProvider = ({ children }) => {
  const [state, setState] = useState({
    isOpen: false,
    title: '',
    message: '',
    iz_alert: 0,
    resolvePromise: null,
  });

  // Funkcija koja vraća Promise kada korisnik klikne na dugme
  const showConfirmDialog = (title, message, is_alert) => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        title,
        message,
        iz_alert: 0,
        resolvePromise: resolve,
      });
    });
  };

  const showAlertDialog = (title, message) => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        title,
        message,
        iz_alert: 1,
        resolvePromise: resolve,
      });
    });
  };

 
  const handleClose = (confirmed) => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
    }));
    
    // Rezolvanje Promise-a sa odgovorom korisnika
    if (state.resolvePromise) {
      state.resolvePromise(confirmed);
    }
  };

  return (
    <AlertDialogContext.Provider value={{ showConfirmDialog, showAlertDialog }}>
      {children}

      
      <Dialog 
        open={state.isOpen}
        onClose={() => handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{state.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {state.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions >
            
        {state.iz_alert === 0 ? (
            <>
              <Button onClick={() => handleClose(false)}>Otkaži</Button>
              <Button onClick={() => handleClose(true)} autoFocus>
                Da
              </Button>
            </>
          ) : (
            
            <Button onClick={() => handleClose(true)} autoFocus>
              OK
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </AlertDialogContext.Provider>
  );
};


export const useAlertDialog = () => {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error('useAlertDialog mora biti korišćen unutar AlertDialogProvider-a');
  }
  return context;
};