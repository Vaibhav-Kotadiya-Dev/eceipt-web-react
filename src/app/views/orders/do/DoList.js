import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
// material-ui
import { useTheme } from "@mui/material/styles";

// material-ui
import { Alert, Chip, FormHelperText, Grid, InputBase, Paper, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { IconPlus, IconList, IconListDetails, IconSearch, IconX } from '@tabler/icons-react';
// project imports

import { gridSpacing } from 'common/constant';
import MainCard from 'ui-component/cards/MainCard';
// import { toast } from 'react-toastify';
import ZTitleActionButton from 'ui-component/ZTitleActionButton';
import ZBackdrop from 'ui-component/ZBackdrop';
import { toast } from 'react-toastify';
import ZPromptConfirmation from 'ui-component/ZPromptConfirmation';
import SubCard from 'ui-component/cards/SubCard';
import { DoStatus } from 'app/common/OrderConstant';
import { useAll, useCancel, useReceive, useRevise, useShip, useGetPDF, useRegeneratePDF, useResendEmail } from 'app/services/orders/DeliveryOrderService';
import ZDoCardList from '../component/ZDoCardList';
import ZDoTableList from '../component/ZDoTableList';
import ZPDFViewDialog from "../component/ZPDFViewDialog";
import { API_URL } from "../../../../config";
import { translate } from 'common/functions';


// import TenantService from 'aas/services/TenantService';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const DoList = () => {
    const theme = useTheme()
    const navigate = useNavigate();
    const { t } = useTranslation();

    const pkg = useSelector((state) => state.menu.pkg);

    const [cardView, setCardView] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [orderNumber, setOrderNumber] = useState(null);
    const [orderNumberFilter, setOrderNumberFilter] = useState(null);

    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [resendEmailAddress, setResendEmailAddress] = useState(null);
    const [resendEmailError, setResendEmailError] = useState(false);
    const [openResendEmailConfirmation, setOpenResendEmailConfirmation] = useState(false);
    const [openReceivedConfirmation, setOpenReceivedConfirmation] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);

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

    const { isFetching } = useAll(
        (response) => {
            if (response.code === "SUCCESS") {
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

    const { mutate: revise, isLoading: reviseLoading } = useRevise(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success(t('transaction_success'))
            } else {
                toast.error(response.data.message)
            }
        }, (error) => {
            toast.error(error.message)
        })
    const { mutate: ship, isLoading: shipLoading } = useShip(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success(t('transaction_success'))
            } else {
                toast.error(response.data.message)
            }
        }, (error) => {
            toast.error(error.message)
        })
    const { mutate: receive, isLoading: receivedLoading } = useReceive(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success(t('transaction_success'))
            } else {
                toast.error(response.data.message)
            }
        }, (error) => {
            toast.error(error.message)
        })
    const { mutate: cancel, isLoading: cancelLoading } = useCancel(
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
            setOpenPdfViewer(true)
            setPdfUrl(API_URL.BE_URL + "download/" + response.data.data)
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
        navigate("../do/view", { state: { id: e.id } })
    }
    const handleClickEdit = async (e) => {
        // console.log("Edit", e.id)
        navigate("../do/create", { state: { id: e.id } })
    }
    const handleClickRevise = async (e) => {
        await revise(e.id)
    }
    const handleClickShip = async () => {
        await ship(id)
        setOpenConfirmation(false)
    }
    const handleClickResendEmail = async () => {
        //to check email, replace , ; with |, then split by |, check if all email valid
        let regex = /^\s*([a-zA-Z0-9_-]+)@([\da-zA-Z-]+)\.([a-zA-Z]{2,6})\s*([;,]\s*([a-zA-Z0-9_-]+)@([\da-zA-Z-]+)\.([a-zA-Z]{2,6})\s*)*$/;
        if (resendEmailAddress !== null && resendEmailAddress.trim() !== "" && !regex.test(resendEmailAddress)) {
            setResendEmailError(true)
            return;
        }
        setResendEmailError(false)
        setOpenResendEmailConfirmation(false)
        await resendEmail({ "id": id, "receiverAddress": resendEmailAddress });
    }

    const handleClickReceive = async () => {
        await receive(id)
        setOpenReceivedConfirmation(false)
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
        });
    }

    const handleStatusFilter = async (s) => {
        setStatusFilter(s)
        setOrderNumber(null)
        setOrderNumberFilter(null)
        handleChangePage(0)
    }

    const handleOrderNumberFilter = async (n) => {
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
            id: e.id
        })
    }

    const handleClosePDFViewer = () => {
        setOpenPdfViewer(false)
    }

    return (
        <>
            {(dataLoadingError) && <Alert severity="error" style={{ marginBottom: 10 }}>{t("data_failed_to_load")} {dataLoadingError ?? ''} </Alert>}
            <ZBackdrop open={isFetching || reviseLoading || shipLoading || receivedLoading || cancelLoading || regenerateLoading || getPDFLoading || resendLoading} />
            <ZPDFViewDialog open={openPdfViewer} height={document.body.clientHeight} pdfUrl={pdfUrl} onClickClose={handleClosePDFViewer} />
            <ZPromptConfirmation open={openConfirmation}
                fullWidth
                title={t("please_confirm")}
                text={<>
                    <Typography sx={{ pb: 1 }}>{t("confirm_delivery_order1")}</Typography>
                    <Typography color={theme.palette.error.dark}>{t("confirm_delivery_order2")}</Typography>
                </>}
                confirmButtonText={t('ship')}
                onClickConfirm={handleClickShip}
                enableCancel={true}
                onClickCancel={() => { setOpenConfirmation(false) }}
            />

            <ZPromptConfirmation open={openResendEmailConfirmation}
                fullWidth
                title={t("please_confirm")}
                text={<>
                    <Typography sx={{ pb: 1 }}>{t("confirm_resend_email1")}</Typography>
                    <Typography color={theme.palette.error.dark}>
                        {t("confirm_resend_email2")}</Typography>
                    <TextField
                        style={{ marginTop: 10 }}
                        fullWidth
                        label={t('email')}
                        value={resendEmailAddress ?? ""}
                        onChange={(e) => setResendEmailAddress(e.target.value)}
                    />
                    {resendEmailError && <FormHelperText error>{t("invalid_email_format")}</FormHelperText>}
                </>}
                confirmButtonText={t('send')}
                onClickConfirm={handleClickResendEmail}
                enableCancel={true}
                onClickCancel={() => { setOpenResendEmailConfirmation(false) }}
            />

            <ZPromptConfirmation open={openReceivedConfirmation}
                fullWidth
                title={t("please_confirm")}
                text={<>
                    <Typography color={theme.palette.error.dark}>{t("confirm_goods_received")}</Typography>
                </>}
                confirmButtonText={t('received')}
                onClickConfirm={handleClickReceive}
                enableCancel={true}
                onClickCancel={() => { setOpenReceivedConfirmation(false) }}
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
                    {t("manage_delivery_order")}
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
                    <ZTitleActionButton onClick={() => navigate("../do/create")}>
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
                                    {Object.keys(DoStatus).map(s =>
                                        <Chip key={s} label={translate(s.toUpperCase())}
                                            size="small"
                                            sx={{ backgroundColor: statusFilter === s.toUpperCase() ? DoStatus[s] : 'null', color: 'white', mr: 0.5, '&:hover': { background: DoStatus[s] } }}
                                            onClick={() => handleStatusFilter(s.toUpperCase())} />)}
                                </Grid>
                                <Grid item sx={{ flex: 1 }}>
                                    <Paper sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                        <InputBase
                                            sx={{ ml: 5, flex: 1 }}
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
                            <ZDoCardList
                                data={data}
                                paging={paging}
                                onPageSizeChange={handleChangePageSize}
                                onPageChange={handleChangePage}
                                onClickView={handleClickView}
                                onClickEdit={handleClickEdit}
                                onClickRevise={handleClickRevise}
                                onClickShip={(e) => { setOpenConfirmation(true); setId(e.id) }}
                                onCLickResend={(e) => { setOpenResendEmailConfirmation(true); setId(e.id) }}
                                onClickReceive={(e) => { setOpenReceivedConfirmation(true); setId(e.id) }}
                                onClickCancel={(e) => { setOpenCancel(true); setId(e.id) }}
                                onClickPDF={handleClickPDF}
                                regeneratePDF={handleRegeneratePDF}
                            /> :
                            <ZDoTableList
                                data={data}
                                paging={paging}
                                onPageSizeChange={handleChangePageSize}
                                onPageChange={handleChangePage}
                                onClickView={handleClickView}
                                onClickEdit={handleClickEdit}
                                onClickRevise={handleClickRevise}
                                onClickShip={(e) => { setOpenConfirmation(true); setId(e.id) }}
                                onCLickResend={(e) => { setOpenResendEmailConfirmation(true); setId(e.id) }}
                                onClickReceive={(e) => { setOpenReceivedConfirmation(true); setId(e.id) }}
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

export default DoList;
