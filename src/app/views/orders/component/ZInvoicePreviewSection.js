import { useTranslation } from 'react-i18next';
// material-ui
import { useTheme } from "@mui/material/styles";
import {
    Chip,
    Divider,
    Grid, Typography
} from '@mui/material';


import { gridSpacing } from 'common/constant';
import SubCard from 'ui-component/cards/SubCard';
import { ConvertUTCDateToLocalSimpleDate, translate } from "common/functions";
import { useSetting } from "app/services/SettingService";
import BasicTableSmall from "ui-component/BasicTableSmall";

const ZInvoicePreviewSection = ({ data }) => {
    const theme = useTheme()
    const { t } = useTranslation();

    const { data: settings } = useSetting(
        (response) => {
        },
        (error) => { }
    )

    const getMidStrSample = (mid) => {
        var currentDate = new Date();
        var year = currentDate.getFullYear(); //To get the Current Year

        var month = currentDate.getMonth() + 1; //To get the Current Month
        month = (month <= 9) ? '0' + month : month;

        switch (mid) {
            case "YY":
                return year.toString().substring(2, 4) + '-'
            case "YYMM":
                return year.toString().substring(2, 4) + month + '-'
            default:
                return '';
        }
    }

    return (
        <SubCard sx={{ borderColor: theme.palette.grey[200] }} dividerSX={{ borderColor: theme.palette.grey[200] }}>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container sx={{ display: '', justifyContent: 'space-between' }}>
                        <Grid item xs={3} ></Grid>
                        <Grid item xs={6} >
                            <Typography variant='h2' align='center' color={theme.palette.primary.dark}>{t("invoice").toUpperCase()}</Typography>
                        </Grid>
                        <Grid item xs={3} textAlign={'right'}>
                            {data.status && <Chip label={translate(data.status.toUpperCase())} variant={'outlined'} color="primary" size="small" />}
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={6} textAlign='center'>
                    <Typography variant='h5' align='left'>{t("from").toUpperCase() + ':'}</Typography>
                    <Typography variant='h4' align='left'>{data?.company?.name}</Typography>
                    <Typography variant='body1' align='left'>{data?.company?.addr1}</Typography>
                    <Typography variant='body1' align='left'>{data?.company?.addr2}</Typography>
                    <Typography variant='body1' align='left'>{data?.company?.addr3}</Typography>
                    <Typography variant='body1' align='left'>{data?.company?.addr4}</Typography>
                    {data?.company?.postCode && <Grid align='left'>
                        <Typography display="inline" variant='caption' align='left'>{data?.company?.country + ': '}</Typography>
                        <Typography display="inline" variant='body1' align='left'>{data?.company?.postCode}</Typography>
                    </Grid>}
                    {data?.company?.contactNumber && <Grid align='left'>
                        <Typography display="inline" variant='caption' align='left'>{t("phone") + ': '}</Typography>
                        <Typography display="inline" variant='body1' align='left'>{data?.company?.contactNumber}</Typography>
                    </Grid>}
                    {data?.company?.fax && <Grid align='left'>
                        <Typography display="inline" variant='caption' align='left'>{t("fax") + ': '}</Typography>
                        <Typography display="inline" variant='body1' align='left'>{data?.company?.fax}</Typography>
                    </Grid>}
                    {data?.company?.email && <Grid align='left'>
                        <Typography display="inline" variant='caption' align='left'>{t("email") + ': '}</Typography>
                        <Typography display="inline" variant='body1' align='left'>{data?.company?.email}</Typography>
                    </Grid>}
                    {data?.company?.brn && <Grid align='left'>
                        <Typography display="inline" variant='caption' align='left'>{t("brn") + ': '}</Typography>
                        <Typography display="inline" variant='body1' align='left'>{data?.company?.brn}</Typography>
                    </Grid>}
                </Grid>
                <Grid item xs={6} textAlign='center'>
                    <Typography variant='h5' align='right'>{t("order_to") + ':'}</Typography>
                    <Typography variant='h4' align='right'>{data?.client?.name}</Typography>
                    <Typography variant='body1' align='right'>{data?.client?.addr1}</Typography>
                    <Typography variant='body1' align='right'>{data?.client?.addr2}</Typography>
                    <Typography variant='body1' align='right'>{data?.client?.addr3}</Typography>
                    <Typography variant='body1' align='right'>{data?.client?.addr4}</Typography>
                    {data?.client?.postCode && <Grid align='right'>
                        <Typography display="inline" variant='caption' align='left'>{data?.client?.country + ': '}</Typography>
                        <Typography display="inline" variant='body1' align='left'>{data?.client?.postCode}</Typography>
                    </Grid>}
                    {data?.client?.contactNumber && <Grid align='right'>
                        <Typography display="inline" variant='caption' align='left'>{t("phone") + ': '}</Typography>
                        <Typography display="inline" variant='body1' align='left'>{data?.client?.contactNumber}</Typography>
                    </Grid>}
                    {data?.client?.fax && <Grid align='right'>
                        <Typography display="inline" variant='caption' align='left'>{t("fax") + ': '}</Typography>
                        <Typography display="inline" variant='body1' align='left'>{data?.client?.fax}</Typography>
                    </Grid>}
                    {data?.client?.email && <Grid align='right'>
                        <Typography display="inline" variant='caption' align='left'>{t("email") + ': '}</Typography>
                        <Typography display="inline" variant='body1' align='left'>{data?.client?.email}</Typography>
                    </Grid>}
                    {data?.client?.representative && <Grid align='right'>
                        <Typography display="inline" variant='caption' align='left'>{t("attn_to") + ': '}</Typography>
                        <Typography display="inline" variant='body1' align='left'>{data?.client?.representative}</Typography>
                    </Grid>}
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>

                <Grid item xs={12} textAlign='center'>
                    <Grid container spacing={1}>
                        <Grid item xs={6} align='left'>
                            <Typography display="inline" variant='caption' align='left'>{t("order_number") + ': '}</Typography>
                            {data?.orderNumber ?
                                <Typography display="inline" variant='body1' fontWeight='bold' align='left'>{data?.orderNumber}</Typography> :
                                <Typography display="inline" variant='body1' fontWeight='bold' align='left'>{settings?.data?.invNumberPrefix ? settings?.data?.invNumberPrefix + '-' : null}INV-{getMidStrSample(settings?.data?.invNumberMid)}xxxxx</Typography>
                            }
                        </Grid>
                        {data?.deliveryDate && <Grid item xs={6} align='left'>
                            <Typography display="inline" variant='caption' align='left'>{t("delivery_date") + ': '}</Typography>
                            <Typography display="inline" variant='body1' fontWeight='bold' align='left'>{ConvertUTCDateToLocalSimpleDate(data?.deliveryDate)}</Typography>
                        </Grid>}
                        {data?.invoiceDate && <Grid item xs={6} align='left'>
                            <Typography display="inline" variant='caption' align='left'>{t("invoice_date") + ': '}</Typography>
                            <Typography display="inline" variant='body1' fontWeight='bold' align='left'>{ConvertUTCDateToLocalSimpleDate(data?.invoiceDate)}</Typography>
                        </Grid>}
                        {data?.paymentDueDate && <Grid item xs={6} align='left'>
                            <Typography display="inline" variant='caption' align='left'>{t("payment_due_date") + ': '}</Typography>
                            <Typography display="inline" variant='body1' fontWeight='bold' align='left'>{ConvertUTCDateToLocalSimpleDate(data?.paymentDueDate)}</Typography>
                        </Grid>}
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>

                {data?.items && <>
                    <Grid item xs={12}>
                        <BasicTableSmall noPage data={Object.values(data?.items).map(item => {
                            return {
                                no: item.sequence + 1,
                                name: item.name,
                                description: item.description,
                                quantity: item.quantity,
                                unit: item.uom,
                                total: item.totalPrice,
                                currency: item.currency,
                                remark: item.remark ? t("yes").toUpperCase() : t("no").toUpperCase(),
                            }
                        })} />
                    </Grid>
                    <Grid item xs={12} align='right' sx={{ pr: 5 }}>
                        <Typography variant='caption' align='right' display="inline" >{t("total_quantity").toUpperCase() + ': '}</Typography>
                        <Typography variant='h5' align='right' display="inline" sx={{ pr: 5 }}>{Object.values(data?.items).reduce((a, v) => a = a + (v.quantity ? v.quantity : 0), 0)}</Typography>
                        <Typography variant='caption' align='right' display="inline" >{t("total_amount").toUpperCase() + ': '}</Typography>
                        <Typography variant='h5' align='right' display="inline" >{data?.items[0]?.currency} {Object.values(data?.items).reduce((a, v) => a = a + (v.totalPrice ? v.totalPrice : 0), 0)}</Typography>
                    </Grid>
                </>}
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12} align='left'>
                    <Grid container spacing={1}>
                        {data?.items &&
                            Object.values(data?.terms).map((item, k) =>
                                <Grid item xs={12} key={k}>
                                    <Typography variant='h5' align='right' display="inline" >{item.name + ': '} <Typography display="inline" variant='body1' align='left'>{item.description}</Typography></Typography>
                                </Grid>)

                        }
                    </Grid>
                </Grid>
            </Grid>
        </SubCard>
    )
}

export default ZInvoicePreviewSection;
