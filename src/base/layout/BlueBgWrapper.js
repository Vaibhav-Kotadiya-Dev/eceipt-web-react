// material-ui
import { styled } from '@mui/material/styles';
import Background from 'aas/assets/login_bg.jpg';
// ==============================|| AUTHENTICATION 1 WRAPPER ||============================== //

const BlueBgWrapper = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.primary.light,
    backgroundImage: `url(${Background})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    minHeight: '100vh',
}));

export default BlueBgWrapper;
