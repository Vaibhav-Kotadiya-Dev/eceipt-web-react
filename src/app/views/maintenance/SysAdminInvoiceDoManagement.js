import { useState } from 'react';

// material-ui
// import { useTheme } from "@mui/material/styles";

// material-ui
import { Button, Divider, Grid, TextField, } from '@mui/material';

// project imports

import { gridSpacing } from 'common/constant';
import MainCard from 'ui-component/cards/MainCard';
import { toast } from 'react-toastify';
import { useRegenerateDo, useRegenerateInvoice } from 'app/services/orders/MaintenanceService';
import ZBackdrop from 'ui-component/ZBackdrop';


// ==============================|| DEFAULT DASHBOARD ||============================== //
const Settings = () => {
    // const theme = useTheme()
    const [invoiceTenant, setInvoiceTenant] = useState(null);
    const [invoiceNumber, setInvoiceNumber] = useState(null);

    const [doTenant, setDoTenant] = useState(null);
    const [doNumber, setDoNumber] = useState(null);

    // Queries =====================================================================================================
    const { mutate: generateInvoice, isLoading: generateInvoiceLoading } = useRegenerateInvoice(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success('Generate Success.')
            } else {
                toast.error(response.data.message)
            }
        }, (error) => {
            toast.error(error.message)
        })

    const { mutate: generateDo, isLoading: generateDoLoading } = useRegenerateDo(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success('Generate Success.')
            } else {
                toast.error(response.data.message)
            }
        }, (error) => {
            toast.error(error.message)
        })


    const handleGenerateInvoice = async () => {
        var obj = {
            tenantId: parseInt(invoiceTenant),
            orderNumber: invoiceNumber
        }
        await generateInvoice(obj)

    }

    const handleGenerateDo = async () => {
        var obj = {
            tenantId: parseInt(doTenant),
            orderNumber: doNumber
        }
        await generateDo(obj)

    }
    return (
        <>

            <ZBackdrop open={generateInvoiceLoading || generateDoLoading} />
            <MainCard contentSX={{}} title="Invoice/Delivery Order PDF regenerate">
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} >
                        <Grid container spacing={gridSpacing} alignItems="center">
                            <Grid item xs={3}>
                                <TextField
                                    fullWidth
                                    label="Tenant Id"
                                    value={invoiceTenant ?? ""}
                                    onChange={(e) => { setInvoiceTenant(e.target.value) }} />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    fullWidth
                                    label="Invoice Number"
                                    value={invoiceNumber ?? ""}
                                    onChange={(e) => { setInvoiceNumber(e.target.value) }} />
                            </Grid>
                            <Grid item xs={4} >
                                <Button variant="contained" color="primary" onClick={handleGenerateInvoice}>{'Regenerate Invoice PDF'}</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing} alignItems={'center'}>
                            <Grid item xs={3}>
                                <TextField
                                    fullWidth
                                    label="Tenant Id"
                                    value={doTenant ?? ""}
                                    onChange={(e) => { setDoTenant(e.target.value) }} />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    fullWidth
                                    label="Delivery Order Number"
                                    value={doNumber ?? ""}
                                    onChange={(e) => { setDoNumber(e.target.value) }} />
                            </Grid>
                            <Grid item xs={4}>
                                <Button variant="contained" color='secondary' onClick={handleGenerateDo}>{'Regenerate Delivery Order PDF'}</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </MainCard>

            <MainCard sx={{ mt: 2 }} title="Send Broadcast Notification">
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} >
                        <Grid container spacing={gridSpacing} alignItems="center">
                            <Grid item xs={3}>
                                <TextField
                                    fullWidth
                                    label="Tenant Id"
                                    value={invoiceTenant ?? ""}
                                    onChange={(e) => { setInvoiceTenant(e.target.value) }} />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    fullWidth
                                    label="Notification"
                                    value={""}
                                    onChange={(e) => { }} />
                            </Grid>
                            <Grid item xs={4} >
                                <Button variant="contained" color="primary" onClick={() => { }}>{'Send Notification to Tenant'}</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} >
                        <Divider />
                    </Grid>
                    <Grid item xs={12} >
                        <Grid container spacing={gridSpacing} alignItems='flex-start'>
                            <Grid item xs={8}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Notification"
                                    value={""}
                                    onChange={(e) => { }} />
                            </Grid>
                            <Grid item xs={4} >
                                <Button variant="contained" color="secondary" onClick={() => { }}>{'Send Notification to Tenant'}</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </MainCard>
        </>

    );
};

export default Settings;
