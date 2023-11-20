// material-ui
import { Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
    <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle2" target="_blank" underline="hover">
            expressoom.com
        </Typography>
        <Typography variant="subtitle2" target="_blank" underline="hover">
            &copy; expressoom.com
        </Typography>
    </Stack>
);

export default AuthFooter;
