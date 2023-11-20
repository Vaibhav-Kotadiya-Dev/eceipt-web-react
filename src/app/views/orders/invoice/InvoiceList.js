import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
// material-ui
import { useTheme } from "@mui/material/styles";

// material-ui
import { Alert, Chip, FormControl, FormHelperText, Grid, InputBase, Paper, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { IconPlus, IconList, IconListDetails, IconSearch, IconX } from '@tabler/icons-react';
// project imports

import { gridSpacing } from 'common/constant';
import MainCard from 'ui-component/cards/MainCard';
// import { toast } from 'react-toastify';
import ZTitleActionButton from 'ui-component/ZTitleActionButton';
import ZBackdrop from 'ui-component/ZBackdrop';
import {
    useAllInvoice,
    useCancelInvoice,
    useInvoiceInvoice,
    usePaidInvoice,
    useReviseInvoice,
    useRegeneratePDF,
    useGetPDF,
    useResendEmail
} from 'app/services/orders/InvoiceService';
import ZInvoiceCardList from 'app/views/orders/component/ZInvoiceCardList';
import { toast } from 'react-toastify';
import ZPromptConfirmation from 'ui-component/ZPromptConfirmation';
import SubCard from 'ui-component/cards/SubCard';
import { InvoiceStatus } from 'app/common/OrderConstant';
import ZInvoiceTableList from 'app/views/orders/component/ZInvoiceTableList';
import ZPDFViewDialog from "../component/ZPDFViewDialog";
import { API_URL } from "config"
import { translate } from 'common/functions';
// import TenantService from 'aas/services/TenantService';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const InvoiceList = () => {
    const theme = useTheme()
    const navigate = useNavigate();
    const { t } = useTranslation();

    const pkg = useSelector((state) => state.menu.pkg);

    const [cardView, setCardView] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [orderNumber, setOrderNumber] = useState(null);
    const [orderNumberFilter, setOrderNumberFilter] = useState(null);

    const [openInvoiceConfirmation, setOpenInvoiceConfirmation] = useState(false);
    const [openPaidConfirmation, setOpenPaidConfirmation] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);

    const [resendEmailAddress, setResendEmailAddress] = useState(null);
    const [resendEmailError, setResendEmailError] = useState(false);
    const [openResendEmailConfirmation, setOpenResendEmailInvoiceConfirmation] = useState(false);


    const [dataLoadingError, setDataLoadingError] = useState(null);
    const [data, setData] = useState(null);
    const [paging, setPaging] = useState();

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy] = useState('createdDate,desc');

    const [id, setId] = useState(null);

    const [pdfUrl, setPdfUrl] = useState(null);
    const [openPdfViewer, setOpenPdfViewer] = useState(false);
    // Queries =====================================================================================================

    const { isFetching } = useAllInvoice(
        (response) => {
            if (response.code === "SUCCESS") {
                // var lst = Object.values(response.data.data).map(e => {
                //     return {
                //         id: e.id,
                //         orderNumber: e.orderNumber,
                //         invoiceDate: ConvertUTCDateToLocalSimpleDate(e.invoiceDate),
                //         clientName: e.clientName,
                //         totalProduct: e.totalProduct,
                //         totalPrice: e.totalPrice,
                //         pdf: e.pdfUrl,
                //         status: e.status,
                //     }
                // })

                setData(response.data.data)
                setPaging(response.data.page)
                setDataLoadingError(null)
            } else {
                setDataLoadingError(response.message)
                setData(null)
                setPaging(null)
            }
        },
        (error) => {
            setDataLoadingError(error.message)
            setData(null)
            setPaging(null)
        },
        page, pageSize, sortBy,
        statusFilter, orderNumberFilter
    )

    const { mutate: revise, isLoading: reviseLoading } = useReviseInvoice(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success(t('transaction_success'))
            } else {
                toast.error(response.data.message)
            }
        }, (error) => {
            toast.error(error.message)
        })
    const { mutate: invoice, isLoading: invoiceLoading } = useInvoiceInvoice(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success(t('transaction_success'))
            } else {
                toast.error(response.data.message)
            }
        }, (error) => {
            toast.error(error.message)
        })
    const { mutate: paid, isLoading: paidLoading } = usePaidInvoice(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success(t('transaction_success'))
            } else {
                toast.error(response.data.message)
            }
        }, (error) => {
            toast.error(error.message)
        })
    const { mutate: cancel, isLoading: cancelLoading } = useCancelInvoice(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success(t('transaction_success'))
            } else {
                toast.error(response.data.message)
            }
        }, (error) => {
            toast.error(error.message)
        })

    const { mutate: regeneratePDF, isLoading: regenerateLoading } = useRegeneratePDF(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success(t('generate_pdf_success'))
            } else {
                toast.error(response.data.message)
            }
        }, (error) => {
            toast.error(error.message)
        })

    const { mutate: getPDF, isLoading: getPDFLoading } = useGetPDF(
        (response) => {
            if (response.data.code === "SUCCESS") {
                setOpenPdfViewer(true)
                setPdfUrl(API_URL.BE_URL + "download/" + response.data.data)
            } else {
                toast.error(response.data.message)
            }
        }, (error) => {
            toast.error(error.message)
        })

    const { mutate: resendEmail, isLoading: resendLoading } = useResendEmail(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success(t('resend_email_success'))

            } else {
                toast.error(response.data.message)
            }
            setResendEmailAddress(null);
        }, (error) => {
            toast.error(error.message)
        })

    // Queries =====================================================================================================

    const handleChangePageSize = (e) => {
        setPageSize(parseInt(e.target.value, 10))
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    };

    const handleClickView = async (e) => {
        navigate("../invoice/view", { state: { id: e.id } })
    }
    const handleClickEdit = async (e) => {
        // console.log("Edit", e.id)
        navigate("../invoice/create", { state: { id: e.id } })
    }
    const handleClickRevise = async (e) => {
        await revise(e.id)
    }
    const handleClickInvoice = async () => {
        await invoice(id)
        setOpenInvoiceConfirmation(false)
    }
    const handleClickResendEmail = async () => {
        //to check email, replace , ; with |, then split by |, check if all email valid
        let regex = /^\s*([a-zA-Z0-9_-]+)@([\da-zA-Z-]+)\.([a-zA-Z]{2,6})\s*([;,]\s*([a-zA-Z0-9_-]+)@([\da-zA-Z-]+)\.([a-zA-Z]{2,6})\s*)*$/;
        if (resendEmailAddress !== null && resendEmailAddress.trim() !== "" && !regex.test(resendEmailAddress)) {
            setResendEmailError(true)
            return;
        }

        setResendEmailError(false)
        setOpenResendEmailInvoiceConfirmation(false)

        await resendEmail({ "id": id, "receiverAddress": resendEmailAddress });
    }

    const handleClickPaid = async () => {
        await paid(id)
        setOpenPaidConfirmation(false)
    }

    const handleClickCancel = async () => {
        var obj = {
            id: id,
            status: id
        }
        await cancel(obj)
        setOpenCancel(false)
    }
    const handleClickPDF = async (e) => {
        getPDF({
            id: e.id
        })
    }

    const handleStatusFilter = async (s) => {
        setStatusFilter(s)
        setOrderNumber(null)
        setOrderNumberFilter(null)
        handleChangePage(0)
    }

    const handleOrderNumberFilter = async (e) => {
        // e.preventDefault();

        setOrderNumberFilter(orderNumber)
        setStatusFilter(null)
        handleChangePage(0)
    }

    const handleClearFilter = () => {
        setStatusFilter('ALL')
        setOrderNumber(null)
        setOrderNumberFilter(null)
        handleChangePage(0)
    }

    const handleRegeneratePDF = (e) => {
        regeneratePDF({
            id: e.id,
        })
    }

    const handleClosePDFViewer = () => {
        setOpenPdfViewer(false)
    }


    return (
        <>
            {(dataLoadingError) && <Alert severity="error" style={{ marginBottom: 10 }}>{t("data_failed_to_load")} {dataLoadingError ?? ''} </Alert>}
            <ZBackdrop open={isFetching || reviseLoading || invoiceLoading || paidLoading || cancelLoading || regenerateLoading || getPDFLoading || resendLoading} />
            <ZPDFViewDialog open={openPdfViewer} height={document.body.clientHeight} pdfUrl={pdfUrl} onClickClose={handleClosePDFViewer} />
            <ZPromptConfirmation open={openInvoiceConfirmation}
                fullWidth
                title={t("please_confirm")}
                text={<>
                    <Typography sx={{ pb: 1 }}>{t("invoice_to_client_message1")}</Typography>
                    <Typography color={theme.palette.error.dark}>{t("invoice_to_client_message2")}</Typography>
                </>}
                confirmButtonText={'Invoice'}
                onClickConfirm={handleClickInvoice}
                enableCancel={true}
                onClickCancel={() => { setOpenInvoiceConfirmation(false) }}
            />

            <ZPromptConfirmation open={openResendEmailConfirmation}
                fullWidth
                title={t("please_confirm")}
                text={<>
                    <Typography sx={{ pb: 1 }}>{t("confirm_resend_email1")}</Typography>
                    <Typography color={theme.palette.error.dark} sx={{ pb: 1 }}>
                        {t("confirm_resend_email2")}</Typography>
                    <TextField
                        style={{ marginTop: 10 }}
                        fullWidth
                        label="Email"
                        value={resendEmailAddress ?? ""}
                        onChange={(e) => setResendEmailAddress(e.target.value)}
                    />
                    {resendEmailError && <FormHelperText error>{t("invalid_email_format")}</FormHelperText>}
                </>}
                confirmButtonText={t('send')}
                onClickConfirm={handleClickResendEmail}
                enableCancel={true}
                onClickCancel={() => { setOpenResendEmailInvoiceConfirmation(false) }}
            />


            <ZPromptConfirmation open={openPaidConfirmation}
                fullWidth
                title={t("please_confirm")}
                text={<>
                    <Typography color={theme.palette.error.dark}>{t("payment_received_confirmation")}</Typography>
                </>}
                confirmButtonText={'Paid'}
                onClickConfirm={handleClickPaid}
                enableCancel={true}
                onClickCancel={() => { setOpenPaidConfirmation(false) }}
            />

            <ZPromptConfirmation open={openCancel}
                fullWidth
                title={t("please_confirm")}
                text={<>
                    <Typography color={theme.palette.error.dark}>{t("cancel_order_warning")}</Typography>
                </>}
                deleteButtonText={t('cancel_order')}
                onClickDelete={handleClickCancel}
                enableCancel={true}
                onClickCancel={() => { setOpenCancel(false) }}
            />

            <MainCard
                title={<>
                    {t("manage_invoice")}
                    <ToggleButtonGroup
                        color="primary"
                        size='small'
                        value={cardView}
                        exclusive
                        sx={{ verticalAlign: 'middle', pl: 2 }}
                        onChange={(e, v) => setCardView(v)}>
                        <ToggleButton value={true} sx={{ p: 0.2 }}><IconListDetails fontSize="inherit" stroke={1.5} size="1.5rem" /></ToggleButton>
                        <ToggleButton value={false} sx={{ p: 0.2 }}><IconList fontSize="inherit" stroke={1.5} size="1.5rem" /></ToggleButton>
                    </ToggleButtonGroup>
                </>}
                secondary={pkg === 1 && <>
                    <ZTitleActionButton onClick={() => navigate("../invoice/create")}>
                        <IconPlus fontSize="inherit" stroke={1.5} size="1.5rem" />
                    </ZTitleActionButton>
                </>}
                contentSX={{ pt: 1 }}>

                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} >
                        <SubCard noPadding sx={{ borderColor: theme.palette.primary.light, color: 'red' }} dividerSX={{ borderColor: theme.palette.grey[200] }} contentSX={{ p: 0 }} >
                            <Grid container sx={{ p: 1, alignItems: 'center' }}>
                                <Grid item sx={{ height: '100%' }} >
                                    <Chip label={translate('ALL')}
                                        size="small"
                                        sx={{ backgroundColor: statusFilter === 'ALL' ? theme.palette.primary.main : 'null', color: 'white', mr: 0.5, px: 0.5, '&:hover': { background: theme.palette.primary.main } }}
                                        onClick={() => handleStatusFilter('ALL')} />
                                    {Object.keys(InvoiceStatus).map(s =>
                                        <Chip key={s} label={translate(s.toUpperCase())}
                                            size="small"
                                            sx={{ backgroundColor: statusFilter === s.toUpperCase() ? InvoiceStatus[s] : 'null', color: 'white', mr: 0.5, '&:hover': { background: InvoiceStatus[s] } }}
                                            onClick={() => handleStatusFilter(s.toUpperCase())} />)}
                                </Grid>
                                <Grid item sx={{ flex: 1 }}>
                                    <Paper sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                        <InputBase
                                            sx={{ ml: 5, flex: 1 }}
                                            components={FormControl}
                                            value={orderNumber ?? ''}
                                            placeholder={t("search_order_number")}
                                            inputProps={{ 'aria-label': t("search_order_number") }}
                                            onChange={(e) => setOrderNumber(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleOrderNumberFilter()
                                                }
                                            }} />

                                        <ZTitleActionButton onClick={handleOrderNumberFilter}>
                                            <IconSearch fontSize="inherit" stroke={1.5} size="1.5rem" />
                                        </ZTitleActionButton>
                                        <ZTitleActionButton onClick={handleClearFilter}>
                                            <IconX fontSize="inherit" stroke={1.5} size="1.5rem" />
                                        </ZTitleActionButton>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </SubCard>
                    </Grid>
                    <Grid item xs={12}>
                        {data && (cardView ?
                            <ZInvoiceCardList
                                data={data}
                                paging={paging}
                                onPageSizeChange={handleChangePageSize}
                                onPageChange={handleChangePage}
                                onClickView={handleClickView}
                                onClickEdit={handleClickEdit}
                                onClickRevise={handleClickRevise}
                                onClickInvoice={(e) => { setOpenInvoiceConfirmation(true); setId(e.id) }}
                                onCLickResend={(e) => { setOpenResendEmailInvoiceConfirmation(true); setId(e.id) }}
                                onClickPaid={(e) => { setOpenPaidConfirmation(true); setId(e.id) }}
                                onClickCancel={(e) => { setOpenCancel(true); setId(e.id) }}
                                onClickPDF={handleClickPDF}
                                regeneratePDF={handleRegeneratePDF}
                            /> :
                            <ZInvoiceTableList
                                data={data}
                                paging={paging}
                                onPageSizeChange={handleChangePageSize}
                                onPageChange={handleChangePage}
                                onClickView={handleClickView}
                                onClickEdit={handleClickEdit}
                                onClickRevise={handleClickRevise}
                                onClickInvoice={(e) => { setOpenInvoiceConfirmation(true); setId(e.id) }}
                                onCLickResend={(e) => { setOpenResendEmailInvoiceConfirmation(true); setId(e.id) }}
                                onClickPaid={(e) => { setOpenPaidConfirmation(true); setId(e.id) }}
                                onClickCancel={(e) => { setOpenCancel(true); setId(e.id) }}
                                onClickPDF={handleClickPDF}
                                regeneratePDF={handleRegeneratePDF}
                            />

                        )}
                    </Grid>
                </Grid>
            </MainCard>
        </>

    );
};

export default InvoiceList;
