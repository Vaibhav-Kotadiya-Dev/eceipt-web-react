// material-ui
import { CircularProgress, Backdrop } from '@mui/material';

const ZBackdrop = ({ open }) => {
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            onClick={null}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )



}

export default ZBackdrop;
