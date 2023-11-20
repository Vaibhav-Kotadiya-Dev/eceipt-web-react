import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

// material-ui
import { useTheme } from "@mui/material/styles";
import { Alert, Grid } from '@mui/material';
import { IconCopy } from '@tabler/icons-react';
import dayjs from 'dayjs';

import { toast } from 'react-toastify';
// project imports
import { gridSpacing } from 'common/constant';
import MainCard from 'ui-component/cards/MainCard';

import SubCard from 'ui-component/cards/SubCard';
import ZBackdrop from 'ui-component/ZBackdrop';
import { useAllClientNoPaging } from 'app/services/masters/ClientService';
import { useGetInvoiceById } from 'app/services/orders/InvoiceService';

import ZInvoicePreviewSection from '../component/ZInvoicePreviewSection';
import BasicTable from 'ui-component/BasicTable';
import { ConvertUTCDateToLocalDate } from 'common/functions';
import ZChipButton from 'ui-component/ZChipButton';



// ==============================|| InvoiceView ||============================== //
const InvoiceView = () => {
    const theme = useTheme()
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const [dataLoadingError, setDataLoadingError] = useState(null);

    const [data, setData] = useState(null);
    const [orderNumber, setOrderNumber] = useState(null);
    const [invoiceDate, setInvoiceDate] = useState(dayjs(new Date().toLocaleDateString()));
    const [paymentDueDate, setPaymentDueDate] = useState(dayjs(new Date().toLocaleDateString()));
    const [deliveryDate, setDeliveryDate] = useState(dayjs(new Date().toLocaleDateString()));
    const [clientShortName, setClientShortName] = useState(null);
    const [company, setCompany] = useState(null);
    const [items, setItems] = useState([]);
    const [terms, setTerms] = useState([]);
    const [status, setStatus] = useState(null);
    const [logs, setLogs] = useState([]);

    const { mutate: getInvoice, isLoading } = useGetInvoiceById(
        (response) => {
            // console.log(response.data.data)
            if (response.data.code === "SUCCESS") {
                setData(response.data.data)
                setExistingData(response.data.data)
            } else {
                setData(null)
                toast.error(response.data.message)
            }
        }, (error) => { toast.error(error.message) })

    useEffect(() => {
        // console.log(location?.state?.id)
        if (location.state != null && location.state.id != null) {
            getInvoice(location.state.id)
        } else {
            navigate("../invoice")
        }
    }, [location, getInvoice, navigate]);

    // Queries =====================================================================================================

    const { data: allClients } = useAllClientNoPaging(
        (response) => {
            // console.log(response.data)
            if (response.code === "SUCCESS") {
                setDataLoadingError(null)
            } else {
                setDataLoadingError(response.message)
            }
        },
        (error) => {
            setDataLoadingError(error.message)
        }
    )

    // Functions =====================================================================================================
    const setExistingData = (data) => {
        // console.log(data)
        setCompany(data.company)
        setOrderNumber(data.orderNumber)
        setInvoiceDate(dayjs(new Date(data.invoiceDate).toLocaleDateString()))
        setPaymentDueDate(dayjs(new Date(data.paymentDueDate).toLocaleDateString()))
        setDeliveryDate(dayjs(new Date(data.deliveryDate).toLocaleDateString()))
        setClientShortName(data.clients[0].shortname)
        setStatus(data.status)

        data.logs.sort((obj1, obj2) => obj1.createdDate < obj2.createdDate ? 1 : -1)
        setLogs(Object.values(data.logs).map(o => {
            return {
                id: o.id,
                date: ConvertUTCDateToLocalDate(o.createdDate),
                message: o.message
            }
        }))

        Object.values(data.items).forEach(i => { i.key = i.id })
        Object.values(data.terms).forEach(t => { t.key = t.id })

        setItems(data.items)
        setTerms(data.terms)
    }

    const handleGenerateDo = () => {
        navigate("../do/create", { state: { invoiceNumber: data.orderNumber } })
    }


    return (
        <>
            {(dataLoadingError) && <Alert severity="error" style={{ marginBottom: 10 }}>{t("data_failed_to_load")} {dataLoadingError ?? ''} </Alert>}
            <ZBackdrop open={isLoading} />

            <MainCard contentSX={{}} title={t("create_invoice")} secondary={<>
                <ZChipButton
                    label={t("generate_delivery_order")}
                    onClick={() => handleGenerateDo()}
                    icon={<IconCopy size="1.5rem" />} />
            </>}>
                <Grid container spacing={gridSpacing}>
                    <Grid item md={12} xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} textAlign='center'>
                                <Alert severity="info">{t("data_preview_alert")}.</Alert>
                                {/* <Button sx={{ mr: 2 }} variant="contained" color="primary" disabled={!valid} onClick={() => { }}>{'Preview'}</Button> */}
                            </Grid>
                            <Grid item xs={12} textAlign='center'>
                                <ZInvoicePreviewSection data={{
                                    orderNumber: orderNumber,
                                    invoiceDate: invoiceDate,
                                    paymentDueDate: paymentDueDate,
                                    deliveryDate: deliveryDate,
                                    company: company,
                                    client: clientShortName ? Object.values(allClients?.data?.data).filter(o => o.shortname === clientShortName)[0] : null,
                                    items: items,
                                    terms: terms,
                                    status: status
                                }} />
                            </Grid>

                            {logs.length > 0 &&
                                <Grid item xs={12} textAlign='center'>
                                    <SubCard sx={{ borderColor: theme.palette.grey[200] }} dividerSX={{ borderColor: theme.palette.grey[200] }}>
                                        <BasicTable data={logs} dense={true} rowsPerPage={10} />
                                    </SubCard>
                                </Grid>}
                        </Grid>
                    </Grid>
                </Grid>
            </MainCard>
        </>

    );
};

export default InvoiceView;
