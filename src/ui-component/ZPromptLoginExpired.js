import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
// import { ClearLocalData } from 'common/functions';

const ZPromptLoginExpired = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);

    return (
        <Dialog aria-describedby="simple-modal-description" open={open} fullWidth>
            <DialogTitle id="alert-dialog-title" sx={{fontSize:14, color:'red'}}>
                {"Login Expired"}
            </DialogTitle>
            <DialogContent  >
                <DialogContentText id="alert-dialog-description" color='black'>
                    {"You will be logout from system, please login again."}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ mr: 1 }}>
                <Button variant="contained" color="primary" onClick={() => {
                    // ClearLocalData();
                    setOpen(false)
                    navigate('/login');
                }}>{"OK"}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ZPromptLoginExpired;
