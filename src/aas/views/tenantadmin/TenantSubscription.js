import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { useTheme } from "@mui/material/styles";
// material-ui
import {
    Alert,
    Button,
    Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Typography
} from '@mui/material';
import { IconPointFilled } from '@tabler/icons-react';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';

import ZBackdrop from 'ui-component/ZBackdrop';
import { gridSpacing } from 'common/constant';

// import { toast } from 'react-toastify';
import { useGetPaymentLink, useGetPricePlan } from 'aas/services/PaymentService';
import { toast } from 'react-toastify';


// ==============================|| DEFAULT DASHBOARD ||============================== //
const TenantSubscription = () => {
    const theme = useTheme()
    const navigate = useNavigate();

    const [dataLoadingError, setDataLoadingError] = useState(null);
    const [pricePlan, setPricePlan] = useState(null);

    const { isLoading } = useGetPricePlan(
        (response) => {
            if (response.code === "SUCCESS") {
                response.data.sort((obj1, obj2) => obj1.amount > obj2.amount ? 1 : -1)
                setPricePlan(response.data)
                navigate("../admin/company/subscription")
                setDataLoadingError(null)
            } else {
                setDataLoadingError(response.message)
            }
        }, () => { })


    const { isLoading: paymentLinkLoading, mutate: getPaymentLink } = useGetPaymentLink(
        (response) => {
            // console.log(response)
            if (response.data.code === "SUCCESS") {
                // console.log(response.data.data)
                window.open(response.data.data, '_blank')
                setDataLoadingError(null)
            } else {
                toast.error('Error occurs, please try again later')
                setDataLoadingError(response.message)
            }
        }, () => { })


    const handleGetPaymentLink = async (quantity, price, type) => {
        var data = {
            quantity: quantity,
            priceId: price,
            type: type
        }
        getPaymentLink(data)
    }


    return (
        <>
            {(dataLoadingError) && <Alert severity="error" style={{ marginBottom: 10 }}>Data failed to load. {dataLoadingError ?? ''} </Alert>}
            <ZBackdrop open={isLoading || paymentLinkLoading} />

            <MainCard sx={{ pt: 2 }}>
                <Grid container spacing={gridSpacing} justifyContent="center" >
                    <Grid item xs={12} sx={{ pb: 2 }}>
                        <SubCard contentSX={{ backgroundColor: '' }}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography variant='h3' sx={{ pt: 1, pb: 1 }} color={theme.palette.orange.dark}>Upgrade to Basic Package</Typography>
                                    <Divider />
                                    <Typography variant='h4' sx={{ pt: 2, pb: 1 }}>You can:</Typography>
                                    <List dense>
                                        <ListItem>
                                            <ListItemIcon><IconPointFilled fontSize="inherit" stroke={1.2} size="1.2rem" /></ListItemIcon>
                                            <ListItemText primary="Create Orders from your computer and mobile." />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon><IconPointFilled fontSize="inherit" stroke={1.2} size="1.2rem" /></ListItemIcon>
                                            <ListItemText primary="Auto create PDF and email to your client." />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon><IconPointFilled fontSize="inherit" stroke={1.2} size="1.2rem" /></ListItemIcon>
                                            <ListItemText primary="Various invoice and delivery order template with your company logo." />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon><IconPointFilled fontSize="inherit" stroke={1.2} size="1.2rem" /></ListItemIcon>
                                            <ListItemText primary="View and manage your inventory." />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon><IconPointFilled fontSize="inherit" stroke={1.2} size="1.2rem" /></ListItemIcon>
                                            <ListItemText primary="Support from our specialist" />
                                        </ListItem>
                                    </List>
                                </Grid>
                            </Grid>
                        </SubCard>
                    </Grid>
                </Grid>
                <Grid container spacing={gridSpacing} justifyContent="center" >
                    {pricePlan && Object.values(pricePlan).map((v, k) =>
                        <Grid item md={3} xs={6} key={k}>
                            <SubCard contentSX={{ backgroundColor: '' }}>
                                <Grid container justifyContent='center' direction="column" alignContent={'center'}>
                                    <Grid item textAlign={'center'}>

                                        <Typography variant='h2' sx={{ pt: 2 }} color={theme.palette.primary.main}> {v.name}</Typography>
                                        <Divider sx={{ mt: 3, mb: 2 }} />
                                        <Typography variant='h4' sx={{ pb: 2 }}></Typography>
                                        <Typography variant='h2' display={'inline'} color={theme.palette.grey[700]}>$</Typography>
                                        <Typography variant='h1' display={'inline'} color={theme.palette.primary[800]}>{v.amount / 100}</Typography>
                                        <Typography variant='h4' display={'inline'} color={theme.palette.grey[700]}> /</Typography>
                                        <Typography variant='h4' display={'inline'} color={theme.palette.grey[700]}>{v.priceQuantity ?? ''}</Typography>
                                        <Typography variant='h4' display={'inline'} color={theme.palette.grey[700]}> {v.unit}</Typography>
                                        <Typography variant='h4' sx={{ pb: 3 }}></Typography>
                                        {v.type === 'one_time' ? <Typography variant='h6' color={theme.palette.grey[500]}>One Time Payment</Typography> :
                                            <Typography variant='h6' color={theme.palette.grey[500]}>Monthly Payment</Typography>}

                                        <Typography variant='h4' sx={{ pb: 8 }}></Typography>
                                    </Grid>
                                    <Grid item textAlign={'center'}>
                                        <Button variant='outlined' color="primary" onClick={() => handleGetPaymentLink(v.priceQuantity === null ? 1 : v.priceQuantity, v.price, v.type)} >{'Order Now'} </Button>
                                    </Grid>
                                </Grid>
                            </SubCard>
                        </Grid>
                    )}
                </Grid>
            </MainCard >
        </>
    );
};

export default TenantSubscription;
