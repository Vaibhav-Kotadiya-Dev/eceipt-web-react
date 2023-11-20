import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

// material-ui
import { useTheme } from "@mui/material/styles";
import { Alert, Grid } from '@mui/material';
// import { IconLink } from '@tabler/icons-react';
import dayjs from 'dayjs';

import { toast } from 'react-toastify';
// project imports
import { gridSpacing } from 'common/constant';
import MainCard from 'ui-component/cards/MainCard';

import SubCard from 'ui-component/cards/SubCard';
import ZBackdrop from 'ui-component/ZBackdrop';
import { useAllClientNoPaging } from 'app/services/masters/ClientService';

import BasicTable from 'ui-component/BasicTable';
import { ConvertUTCDateToLocalDate } from 'common/functions';
import ZDoPreviewSection from '../component/ZDoPreviewSection';
import { useGetById } from 'app/services/orders/DeliveryOrderService';
// import ZChipButton from 'ui-component/ZChipButton';




// ==============================|| DoView ||============================== //
const DoView = () => {
    const inputDate = new Date().toLocaleDateString();
    const parts = inputDate.split('/');
    const reformattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    const theme = useTheme()
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const [dataLoadingError, setDataLoadingError] = useState(null);

    const [orderNumber, setOrderNumber] = useState(null);
    const [deliveryDate, setDeliveryDate] = useState(dayjs(reformattedDate));
    const [clientShortName, setClientShortName] = useState(null);
    const [company, setCompany] = useState(null);
    const [items, setItems] = useState([]);
    const [terms, setTerms] = useState([]);
    const [status, setStatus] = useState(null);
    const [invoiceNumber, setInvoiceNumber] = useState(null);
    const [logs, setLogs] = useState([]);

    const { mutate: getOrder, isLoading } = useGetById(
        (response) => {
            // console.log(response.data.data)
            if (response.data.code === "SUCCESS") {
                setExistingData(response.data.data)
            } else {
                toast.error(response.data.message)
            }
        }, (error) => { toast.error(error.message) })

    useEffect(() => {
        // console.log(location?.state?.id)
        if (location.state != null && location.state.id != null) {
            getOrder(location.state.id)
        } else {
            navigate("../do")
        }
    }, [location, getOrder, navigate]);

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
        const doDate = new Date(data.deliveryDate).toLocaleDateString();
        const doParts = doDate.split('/');
        const doReformattedDate = `${doParts[2]}-${doParts[1]}-${doParts[0]}`;
        // console.log(data)
        setCompany(data.company)
        setOrderNumber(data.orderNumber)
        setDeliveryDate(dayjs(doReformattedDate))
        setClientShortName(data.clients[0].shortname)
        setStatus(data.status)

        if (data.logs) {
            data.logs.sort((obj1, obj2) => obj1.createdDate < obj2.createdDate ? 1 : -1)

            setLogs(Object.values(data.logs).map(o => {
                return {
                    id: o.id,
                    date: ConvertUTCDateToLocalDate(o.createdDate),
                    message: o.message
                }
            }))
        }

        Object.values(data.items).forEach(i => { i.key = i.id })
        Object.values(data.terms).forEach(t => { t.key = t.id })

        setItems(data.items)
        setTerms(data.terms)
        setInvoiceNumber(data.invoiceNumber)
    }

    // const handleLinkInvoice = () => {
    //     console.log('click handleLinkInvoice')

    //     //delivery order add invoice field, need to think about how to update inventory transaction here.
    // }

    return (
        <>
            {(dataLoadingError) && <Alert severity="error" style={{ marginBottom: 10 }}>{t("data_failed_to_load")} {dataLoadingError ?? ''} </Alert>}
            <ZBackdrop open={isLoading} />

            <MainCard contentSX={{}} title="View Delivery Order" secondary={<>
                {/* {status === 'GENERATED' &&
                    <ZChipButton
                        label={t("update_linked_invoice")}
                        onClick={() => handleLinkInvoice()}
                        icon={<IconLink size="1.5rem" />} />} */}
            </>}>
                <Grid container spacing={gridSpacing}>
                    <Grid item md={12} xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} textAlign='center'>
                                <Alert severity="info">{t("data_preview_alert")}.</Alert>
                                {/* <Button sx={{ mr: 2 }} variant="contained" color="primary" disabled={!valid} onClick={() => { }}>{'Preview'}</Button> */}
                            </Grid>
                            <Grid item xs={12} textAlign='center'>
                                <ZDoPreviewSection data={{
                                    orderNumber: orderNumber,
                                    deliveryDate: deliveryDate,
                                    company: company,
                                    client: clientShortName ? Object.values(allClients?.data?.data).filter(o => o.shortname === clientShortName)[0] : null,
                                    items: items,
                                    terms: terms,
                                    status: status,
                                    invoiceNumber: invoiceNumber
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

export default DoView;
