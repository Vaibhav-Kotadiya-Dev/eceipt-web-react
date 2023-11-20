import { useTranslation } from 'react-i18next';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, Typography
} from '@mui/material';

import { gridSpacing } from 'common/constant';
import BasicTableSmall from 'ui-component/BasicTableSmall';
import SubCard from 'ui-component/cards/SubCard';


const DetailCardStyled = ({ title1, title2, children, color }) => {
    const theme = useTheme();
    return (<SubCard
        title={<>
            <Typography variant='body1' color={theme.palette.grey[800]} display={'inline'} >{title1}</Typography>
            {title2 && <Typography component={'span'} variant='h4' display={'inline'} sx={{ pl: 1 }}>{title2}</Typography>}
        </>}
        sx={{ border: 1, borderColor: color }}
        dividerSX={{ borderColor: color }}
        contentSX={{ p: 1 }} >
        {children}
    </SubCard>)
}

const ZDoInvoiceCheckDialog = ({ open, onClickOk, invoiceData, currentDo, previousDo }) => {
    const theme = useTheme();
    const { t } = useTranslation();

    return (
        <Dialog aria-describedby="simple-modal-description" open={open} maxWidth={'lg'} fullWidth>
            <DialogTitle id="alert-dialog-title">
                <Typography variant='h4' color={theme.palette.error.dark}>{t("do_inv_mismatch_error")}</Typography>
            </DialogTitle>
            <DialogContent color='black'>
                <Grid container spacing={gridSpacing} justifyContent='center'>
                    <Grid item md={6} xs={12}>
                        <DetailCardStyled color={theme.palette.error.light} title1={t("linked_invoice")} title2={invoiceData?.orderNumber}>
                            {invoiceData &&
                                <BasicTableSmall noPage dense={'small'} data={Object.values(invoiceData?.items).map(item => {
                                    return { name: item.name, quantity: item.quantity, unitprice: item.unitprice + ' ' + item.currency + '/' + item.uom }
                                })} />}
                        </DetailCardStyled>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Grid container spacing={gridSpacing} justifyContent='center'>
                            <Grid item md={12} xs={12}>
                                <DetailCardStyled color={theme.palette.primary.main} title1={t("current_do")} title2={currentDo?.orderNumber}>
                                    {invoiceData &&
                                        <BasicTableSmall noPage dense={'small'} data={Object.values(currentDo?.items).map(item => {
                                            return { name: item.name, quantity: item.quantity }
                                        })} />}
                                </DetailCardStyled>
                            </Grid>
                            <Grid item md={12} xs={12}>
                                {previousDo && Object.values(previousDo).filter(d => d.orderNumber !== currentDo.orderNumber).map(doData => (
                                    <DetailCardStyled key={doData.id} color={theme.palette.primary[200]} title1={t("previous_do")} title2={doData?.orderNumber}>
                                        {invoiceData &&
                                            <BasicTableSmall noPage dense={'small'} data={Object.values(doData?.items).map(item => {
                                                return { name: item.name, quantity: item.quantity }
                                            })} />}
                                    </DetailCardStyled>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ mr: 5, pb: 2 }}>
                <Button variant='contained' color="primary" onClick={onClickOk}>{t("ok")}</Button>
            </DialogActions>
        </Dialog >
    )
}

export default ZDoInvoiceCheckDialog;
