// material-ui
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const ZPromptConfirmation = ({ open, title, text, confirmButtonText, deleteButtonText, enableCancel, onClickConfirm, onClickDelete, onClickCancel }) => {
    const { t } = useTranslation();
    return (
        <Dialog aria-describedby="simple-modal-description" open={open} fullWidth>
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent  >
                {/* <DialogContentText id="alert-dialog-description" color='black'> */}
                {text}
                {/* </DialogContentText> */}
            </DialogContent>
            <DialogActions sx={{ mr: 1 }}>
                {confirmButtonText &&
                    <Button variant="contained" color="primary" onClick={onClickConfirm}>{confirmButtonText}</Button>}
                {deleteButtonText &&
                    <Button variant="contained" color="error" onClick={onClickDelete}>{deleteButtonText}</Button>}
                {enableCancel &&
                    <Button variant="outlined" color="primary" onClick={onClickCancel}>{t('cancel')}</Button>}
            </DialogActions>
        </Dialog>
    )
}

export default ZPromptConfirmation;
