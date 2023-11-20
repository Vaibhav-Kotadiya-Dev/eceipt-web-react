import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

// material-ui
import {
    Alert, Button, Typography
} from '@mui/material';


import { useTenantInfo } from 'aas/services/TenantAdminService';


// ==============================|| DEFAULT DASHBOARD ||============================== //

const SubscriptionAlert = () => {
    const theme = useTheme()
    const navigate = useNavigate();
    const { data } = useTenantInfo(() => { }, () => { })

    return (
        <>
            {data?.data?.subscription === 'FREE' &&
                <Alert severity="warning" style={{ marginBottom: 10, backgroundColor: theme.palette.warning.light }}>
                    <Typography variant="inherit" component={Button} textAlign={'left'} sx={{
                        p: 0, textDecoration: 'none', color: theme.palette.primary.dark, '&:hover': {
                            textDecoration: "underline",
                            backgroundColor: 'white'
                        }
                    }} onClick={() => (navigate("../admin/company/subscription"))}><strong>Subscribe</strong></Typography> to BASIC package to enjoy <strong>Full feature</strong> of ECEIPE. </Alert>
            }
        </>
    );
};

export default SubscriptionAlert;
