import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
// material-ui
import {
    Alert,
    Button,
    Chip,
    Divider, Grid, Typography
} from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';

import { gridSpacing } from 'common/constant';

// import { toast } from 'react-toastify';

import { useCancelSubscription, useGetTenatPaymentStatus, useGetTenatPaymentTrans } from 'aas/services/PaymentService';
import ZCollapsibleBox from 'ui-component/ZCollapsibleBox';
import { ConvertUTCDateToLocalDate, ConvertUTCDateToLocalDay, ConvertUTCDateToLocalSimpleDate } from 'common/functions';
import ZTextWithTitle from 'ui-component/ZTextWithTitle';
import { PaymentHealth } from 'aas/common/constant';
import BasicTableSmall from 'ui-component/BasicTableSmall';
import ZBackdrop from 'ui-component/ZBackdrop';
import { toast } from 'react-toastify';
import ZPromptConfirmation from 'ui-component/ZPromptConfirmation';


// ==============================|| DEFAULT DASHBOARD ||============================== //
const CompanyProfileSubscriptionSection = ({ tenantData }) => {
    const theme = useTheme()
    const { t } = useTranslation();

    const navigate = useNavigate();
    const [dataLoadingError, setDataLoadingError] = useState(null);
    const [cancelDialog, setCancelDialog] = useState(false);
    // console.log(data)

    const { data: paymentStatus, isLoading } = useGetTenatPaymentStatus(
        (response) => {
            // console.log('paymentStatus', response)
            if (response.code === "SUCCESS") {
                setDataLoadingError(null)
            } else {
                setDataLoadingError(response.message)
            }
        }, () => { })

    const { data: paymentTrans } = useGetTenatPaymentTrans(
        (response) => {
            // console.log('paymentTrans', response)
            if (response.code === "SUCCESS") {
                setDataLoadingError(null)
            } else {
                setDataLoadingError(response.message)
            }
        }, () => { })

    const { mutate: cancelSubscription, isLoading: cancelLoading } = useCancelSubscription(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success(t("subscription_cancelled"))
            } else {
                toast.error(response.data.message)
            }
        },
        (error) => {
            toast.error(error.message)
        })

    const handleCancelSubscription = async () => {
        //update company image to null
        await cancelSubscription()
        setCancelDialog(false)
    };

    return (
        <>
            {(dataLoadingError) && <Alert severity="error" style={{ marginBottom: 10 }}>{t("data_failed_to_load")} {dataLoadingError ?? ''} </Alert>}
            <ZBackdrop open={isLoading || cancelLoading} />

            <Grid sx={{ mt: 2 }}></Grid>

            <ZPromptConfirmation open={cancelDialog}
                fullWidth
                title={t("please_confirm")}
                text={t("subscription_cancel_message")}
                deleteButtonText={t("cancel_subscription")}
                enableCancel={true}
                onClickDelete={handleCancelSubscription}
                onClickCancel={() => { setCancelDialog(false) }}
            />

            <ZCollapsibleBox header={<>
                <Typography variant='h4' display={'inline'} sx={{ pr: 2 }}>{t("company_subscription")}</Typography>

                {paymentStatus?.data &&
                    <Chip label={paymentStatus?.data?.health} color="primary" style={{ backgroundColor: PaymentHealth[paymentStatus?.data?.health], color: 'white', padding: 0 }} size="small" />}

                {tenantData?.subscription !== 'FREE' && paymentStatus?.data?.mode === 'RECURRING' && paymentStatus?.data?.recurringSubscriptionStatus === "active" ?
                    <></>
                    :
                    <Typography variant="h3" noWrap component={Button} justifyContent={'left'}
                        sx={{
                            p: 0, pl: 2, textDecoration: 'none', color: theme.palette.primary.dark, '&:hover': {
                                textDecoration: "underline", backgroundColor: 'white'
                            }
                        }} onClick={() => (navigate("../admin/company/subscription"))}>{tenantData?.subscription === 'FREE' ? t("subscribe") : t("extend_expiry_date")}</Typography>}
            </>}
                contents={tenantData?.subscription !== 'FREE' && <>
                    <Grid container justifyContent='flex-start' spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <SubCard disableHover sx={{ border: 0 }}>
                                <Grid container justifyContent='flex-start' spacing={gridSpacing}>
                                    <Grid item md={4} xs={4}>
                                        <ZTextWithTitle
                                            title={t("subscribe")} titleToolTips={''}
                                            text={tenantData?.subscription} textToolTips={''} />
                                    </Grid>
                                    <Grid item md={4} xs={4}>
                                        <ZTextWithTitle
                                            title={t("expire_date")} titleToolTips={''}
                                            text={ConvertUTCDateToLocalSimpleDate(tenantData?.expireDate)} textToolTips={''} />
                                    </Grid>
                                    <Grid item md={4} xs={4}>
                                        <ZTextWithTitle
                                            title={t("health")} titleToolTips={''}
                                            text={paymentStatus?.data?.health} textToolTips={''} />
                                    </Grid>
                                    <Grid item md={4} xs={4}>
                                        <ZTextWithTitle
                                            title={t("payment_provider")} titleToolTips={''}
                                            text={paymentStatus?.data?.provider} textToolTips={''} />
                                    </Grid>
                                    <Grid item md={4} xs={4}>
                                        <ZTextWithTitle
                                            title={t("payment_mode")} titleToolTips={''}
                                            text={paymentStatus?.data?.mode === 'ONETIME' ? t("one_time_payment") : t("subscription")} textToolTips={''} />
                                    </Grid>

                                    {paymentStatus?.data?.mode === 'RECURRING' && <>
                                        <Grid item xs={12} sx={{ my: 1 }}>
                                            <Divider />
                                        </Grid>
                                        <Grid item md={4} xs={4}>
                                            <ZTextWithTitle
                                                title={t("recurring_payment_status")} titleToolTips={''}
                                                text={
                                                    <><Chip component={'span'} label={paymentStatus?.data?.recurringSubscriptionStatus.toUpperCase()}
                                                        variant={paymentStatus?.data?.recurringSubscriptionStatus === 'active' ? 'filled' : 'outlined'} color='primary' size="small" />

                                                        {paymentStatus?.data?.recurringSubscriptionStatus === 'active' &&
                                                            <Typography variant={'h5'} noWrap component={Button} justifyContent={'left'}
                                                                sx={{
                                                                    p: 0, pl: 2, textDecoration: 'none', color: theme.palette.primary.dark, '&:hover': {
                                                                        textDecoration: "underline", backgroundColor: 'white'
                                                                    }
                                                                }} onClick={() => (setCancelDialog(true))}>{t("cancel_subscription")}</Typography>}
                                                    </>

                                                } textToolTips={''} />
                                        </Grid>

                                        {paymentStatus?.data?.recurringSubscriptionStatus !== 'canceled' && paymentStatus?.data?.mode === 'ONETIME' && <>
                                            <Grid item md={4} xs={4}>
                                                <ZTextWithTitle
                                                    title={t("payment_date")} titleToolTips={''}
                                                    text={ConvertUTCDateToLocalDay(paymentStatus?.data?.recurringSubscriptionBillingCycle) + ' ' + t("monthly")} textToolTips={''} />
                                            </Grid>
                                            <Grid item md={4} xs={4}>
                                                <ZTextWithTitle
                                                    title={t("customer_email")} titleToolTips={''}
                                                    text={paymentStatus?.data?.recurringSubscriptionCustomerEmail} textToolTips={''} />
                                            </Grid>
                                            <Grid item md={4} xs={4}>
                                                <ZTextWithTitle
                                                    title={t("customer_id")} titleToolTips={''}
                                                    text={paymentStatus?.data?.recurringSubscriptionCustomer} textToolTips={''} />
                                            </Grid>
                                            <Grid item md={4} xs={4}>
                                                <ZTextWithTitle
                                                    title={t("subscription_id")} titleToolTips={''}
                                                    text={paymentStatus?.data?.recurringSubscriptionId} textToolTips={''} />
                                            </Grid>
                                        </>}
                                    </>}

                                </Grid>
                            </SubCard>
                        </Grid>
                        <Grid item xs={12}>
                            <SubCard title={t("transaction_history")}>
                                <Grid container justifyContent='flex-start' spacing={gridSpacing}>
                                    <Grid item md={12} xs={12}>
                                        {paymentTrans &&
                                            <BasicTableSmall data={Object.values(paymentTrans?.data).map(trans => {
                                                return {
                                                    date: ConvertUTCDateToLocalDate(trans.transactionDate),
                                                    type: trans.type,
                                                    provider: trans.provider,
                                                    mode: trans.mode,
                                                    amount: trans.currency.toUpperCase() + ' ' + trans.amount / 100,
                                                    quantity: trans.quantity + ' ' + t("monthly"),
                                                    status: trans.status === 'succeeded' ? t("success") : trans.status
                                                }
                                            })} />}
                                    </Grid>
                                </Grid>
                            </SubCard>
                        </Grid>
                    </Grid>

                </>} />

        </>
    );
};

export default CompanyProfileSubscriptionSection;
