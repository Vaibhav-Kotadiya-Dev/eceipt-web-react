import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';

// material-ui
import { useTheme } from "@mui/material/styles";
import { Alert, Button, Divider, FormControlLabel, Grid, MenuItem, Switch, TextField, Tooltip, Typography } from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import { IconPlus } from '@tabler/icons-react';

import { toast } from 'react-toastify';
// project imports
import { gridSpacing } from 'common/constant';
import MainCard from 'ui-component/cards/MainCard';

import SubCard from 'ui-component/cards/SubCard';
import ZTitleActionButton from 'ui-component/ZTitleActionButton';
import ZBackdrop from 'ui-component/ZBackdrop';
import { useAllClientNoPaging } from 'app/services/masters/ClientService';
import ZAddProductDialog from 'app/views/orders/component/ZAddProductDialog';
import ZDraggableInvoiceProductList from 'app/views/orders/component/ZDraggableInvoiceProductList';
import ZAddTermDialog from '../component/ZAddTermDialog';
import { QUERY } from 'aas/common/constant';
import ZDraggableTermList from '../component/ZDraggableTermList';
import { useFinalizeInvoice, useGetInvoiceById, usePreviewPDF, useSaveInvoice } from 'app/services/orders/InvoiceService';
import { useTenantInfo } from 'aas/services/TenantAdminService';
import ZInvoicePreviewSection from '../component/ZInvoicePreviewSection';
import ZPromptConfirmation from 'ui-component/ZPromptConfirmation';
import { API_URL } from "../../../../config";
import ZPDFViewDialog from "../component/ZPDFViewDialog";



// ==============================|| InvoiceCreateUpdate ||============================== //
const InvoiceCreateUpdate = () => {
    const theme = useTheme()
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient()
    const { t } = useTranslation();

    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [dataLoadingError, setDataLoadingError] = useState(null);
    const [enableGenerate, setEnableGenerate] = useState(false);
    const [addProduct, setAddProduct] = useState(false);
    const [addTerm, setAddTerm] = useState(false);

    const [id, setId] = useState(null);
    const [orderNumber, setOrderNumber] = useState(null);
    const [invoiceDate, setInvoiceDate] = useState(dayjs('2023-09-29'));
    const [paymentDueDate, setPaymentDueDate] = useState(dayjs('2023-09-29'));
    const [deliveryDate, setDeliveryDate] = useState(dayjs('2023-09-29'));
    const [clientShortName, setClientShortName] = useState(null);
    const [company, setCompany] = useState(null);
    const [items, setItems] = useState([]);
    const [terms, setTerms] = useState([]);
    const [status, setStatus] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [openPdfViewer, setOpenPdfViewer] = useState(false);
    const [withInvTrans, setWithInvTrans] = useState(true);

    const { mutate: getInvoice } = useGetInvoiceById(
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
            setId(location.state.id)
            getInvoice(location.state.id)
        }
    }, [location, setId, getInvoice]);

    const validate = () => {
        var flag = true
        if (invoiceDate === null || paymentDueDate === null || deliveryDate === null) {
            flag = false;
        }
        if (clientShortName === null) {
            flag = false;
        }
        if (items.length === 0 || terms.length === 0) {
            flag = false;
        }

        Object.values(items).forEach(i => {
            // console.log(i.quantity, i.unitprice, (i.quantity === null || i.quantity === undefined || i.quantity === 0 || i.unitprice === 0))
            if (i.quantity === null || i.quantity === undefined || i.quantity === 0 || i.unitprice === 0) {
                flag = false;
            }
        })

        return flag
    }

    // Queries =====================================================================================================
    useTenantInfo(
        (response) => {
            if (response.code === "SUCCESS") {
                // response.data.profileImage = null
                setCompany({ ...response.data, name: response.data.tenantName })
                setDataLoadingError(null)
            } else {
                setDataLoadingError(t("loading_company_info") + ":", response.message)
            }
        }, () => { })

    const { mutate: finalize, isLoading: finalizeLoading } = useFinalizeInvoice(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success(t("invoice_saved"))
                navigate("../invoice")

            } else {
                toast.error(response.data.message)
            }
        }, (error) => {
            setEnableGenerate(false)
            toast.error(error.message)
        })


    const { mutate: createObj, isLoading: createLoading } = useSaveInvoice(
        (response) => {
            if (response.data.code === "SUCCESS") {
                getInvoice(response.data.data.id)
                setEnableGenerate(true)
                toast.success(t("invoice_saved"))
            } else {
                setEnableGenerate(false)
                toast.error(response.data.message)
            }
        }, (error) => {
            setEnableGenerate(false)
            toast.error(error.message)
        })

    const { data: allClients } = useAllClientNoPaging(
        (response) => {
            // console.log(response.data)
            if (response.code === "SUCCESS") {
                setDataLoadingError(null)
            } else {
                setDataLoadingError(t("loading_existing_client") + ":", response.message)
            }
        },
        (error) => {
            setDataLoadingError(error.message)
        }
    )

    const { mutate: previewPDF, isLoading: getPDFLoading } = usePreviewPDF(
        (response) => {
            if (response.data.code === "SUCCESS") {
                setOpenPdfViewer(true)
                setPdfUrl(API_URL.BE_URL + "download/preview/" + response.data.data)
            } else {
                toast.error(response.data.message)
            }
        }, (error) => {
            toast.error(error.message)
        })

    // Functions =====================================================================================================
    const setExistingData = (data) => {
        // console.log(data)
        setId(data.id)
        setOrderNumber(data.orderNumber)
        setInvoiceDate(dayjs(new Date(data.invoiceDate).toLocaleDateString()))
        setPaymentDueDate(dayjs(new Date(data.paymentDueDate).toLocaleDateString()))
        setDeliveryDate(dayjs(new Date(data.deliveryDate).toLocaleDateString()))
        setClientShortName(data.clients[0].shortname)
        setWithInvTrans(data.withInvTrans)
        setStatus(data.status)

        Object.values(data.items).forEach(i => { i.key = i.id })
        Object.values(data.terms).forEach(t => { t.key = t.id })

        setItems(data.items)
        setTerms(data.terms)
    }

    // const test = () => {
    //     console.log(company)
    // }

    const handleSaveDraft = async () => {

        if (validate() !== true) {
            toast.error(t("fill_all_field_warning"));
            return
        }

        var itemMap = []
        items.forEach(i => {
            if (itemMap.indexOf(i.currency) === -1) {
                itemMap.push(i.currency)
            }
        })

        if (itemMap.length !== 1) {
            toast.error(t("invoice_multi_currency_error"));
            return
        }

        var client = Object.values(allClients?.data?.data).filter(o => o.shortname === clientShortName)[0];
        client.id = null
        var totalProduct = []
        var totalQuantity = 0
        var totalPrice = 0

        var seq = 0;
        Object.values(items).forEach(i => {
            i.sequence = seq
            i.totalPrice = i.quantity * i.unitprice
            seq += 1
            totalQuantity += i.quantity
            totalPrice += i.quantity * i.unitprice

            if (totalProduct.indexOf(i.code) === -1) {
                totalProduct.push(i.code)
            }
        })

        var invoice = {
            id: id,
            orderNumber: orderNumber,
            invoiceDate: new Date(invoiceDate).getTime(),
            deliveryDate: new Date(deliveryDate).getTime(),
            paymentDueDate: new Date(paymentDueDate).getTime(),
            clientName: client.name,
            company: company,
            totalProduct: totalProduct.length,
            totalQuantity: totalQuantity,
            totalPrice: totalPrice,
            items: items,
            clients: [client],
            terms: terms,
            withInvTrans: withInvTrans
        }

        await createObj(invoice)
    }

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const handleClickAddProduct = (lst) => {
        var newLst = [...items, ...lst]
        Object.values(newLst).forEach((i, k) => {
            i.sequence = k
        })

        setItems(newLst)

        setAddProduct(false)
    }

    const onDragEndItem = ({ destination, source }) => {
        if (!destination) return;
        const newItems = reorder(items, source.index, destination.index);
        Object.values(newItems).forEach((i, k) => {
            i.sequence = k
        })


        setItems(newItems);
    };

    const handleOnChangeValueItem = (key, name, value) => {
        var lst = Object.values(items)
            .map((v, k) => {
                if (v.key === key) {
                    v = { ...v, [name]: value }
                }
                v.totalPrice = v.quantity * v.unitprice
                return v
            })
        setItems(lst)
    };

    const handleOnRemoveItem = (id) => {
        setItems(Object.values(items).filter(o => o.id !== id))
    };

    const handleClickAddTerm = (lst) => {
        //term with same name only can add once
        var filteredOrgList = Object.values(terms).filter(t => Object.values(lst).filter(l => l.name === t.name).length === 0)

        setTerms([...filteredOrgList, ...lst])
        setAddTerm(false)
    }

    const onDragEndTerm = ({ destination, source }) => {
        if (!destination) return;
        const newItems = reorder(terms, source.index, destination.index);
        setTerms(newItems);
    };

    const handleOnRemoveTerm = (id) => {
        setTerms(Object.values(terms).filter(o => o.id !== id))
    };


    const finalizeInvoice = async () => {
        await finalize(id)
    }

    const handlePreviewPDF = async () => {
        previewPDF({
            id: id,
        })
    }

    const handleClosePDFViewer = () => {
        setOpenPdfViewer(false)
    }

    return (
        <>
            {(dataLoadingError) && <Alert severity="error" style={{ marginBottom: 10 }}>{t("data_failed_to_load")} {dataLoadingError ?? ''} </Alert>}
            <ZBackdrop open={createLoading || finalizeLoading || getPDFLoading} />
            <ZPDFViewDialog open={openPdfViewer} height={document.body.clientHeight} pdfUrl={pdfUrl} onClickClose={handleClosePDFViewer} />
            <ZAddProductDialog open={addProduct} onClickAdd={handleClickAddProduct} onClickCancel={() => setAddProduct(false)} />
            <ZAddTermDialog open={addTerm} onClickAdd={handleClickAddTerm} onClickCancel={() => setAddTerm(false)} />

            <ZPromptConfirmation open={openConfirmation}
                fullWidth
                title={t("please_confirm")}
                text={<>
                    <Typography sx={{ pb: 1 }}>{t("finalise_invoice_message")}</Typography>
                    <Typography color={theme.palette.error.dark}>{t("generate_order_number_message")}</Typography>
                </>}
                confirmButtonText={t("finalize")}
                onClickConfirm={finalizeInvoice}
                enableCancel={true}
                onClickCancel={() => { setOpenConfirmation(false) }} />

            <MainCard contentSX={{}} title={t("create_invoice")} secondary={<>
                <Tooltip title={t("enable_inv_trans_msg")}>
                    <FormControlLabel control={<Switch checked={withInvTrans} color='error' onClick={() => setWithInvTrans(!withInvTrans)} />}
                        label={<Typography color={theme.palette.error.dark}>{t("enable_inv_trans")}</Typography>} />
                </Tooltip>
            </>
            }>
                <Grid container spacing={gridSpacing}>
                    <Grid item md={6} xs={12}>
                        <SubCard sx={{ borderColor: theme.palette.grey[200] }} dividerSX={{ borderColor: theme.palette.grey[200] }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid container spacing={gridSpacing}>
                                    {orderNumber &&
                                        <Grid item xs={12}>
                                            <Typography display="inline" variant='caption' align='left'>{t("order_number") + ' : '}</Typography>
                                            <Typography display="inline" variant='h4' align='left'>{orderNumber}</Typography>
                                        </Grid>}

                                    <Grid item md={6} xs={12}>
                                        <DatePicker
                                            sx={{ width: '100%' }}
                                            label={t("invoice_date")}
                                            value={invoiceDate}
                                            onChange={(value) => setInvoiceDate(value)}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <DatePicker
                                            sx={{ width: '100%' }}
                                            label={t("payment_due_date")}
                                            value={paymentDueDate}
                                            onChange={(value) => setPaymentDueDate(value)}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <DatePicker
                                            sx={{ width: '100%' }}
                                            label={t("delivery_date")}
                                            value={deliveryDate}
                                            onChange={(value) => setDeliveryDate(value)}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            select
                                            label={t("select_client")}
                                            value={clientShortName ?? ""}
                                            onChange={(e) => {
                                                // console.log(e.target.value)
                                                setClientShortName(e.target.value)
                                            }}
                                            SelectProps={{
                                                renderValue: (shortname) => allClients && Object.values(allClients?.data?.data).filter((e, k) => shortname === e.shortname)[0].name
                                            }}>
                                            <MenuItem key={''} value={''} style={{ display: "none" }}>{t("none")}</MenuItem>
                                            {allClients && Object.values(allClients?.data?.data).map((v, k) =>
                                                <MenuItem key={k} value={(v.shortname)}>
                                                    {v.name} &nbsp; <Typography variant='caption'>[{v.shortname}]</Typography>
                                                </MenuItem>)}
                                        </TextField>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Grid container justifyContent="space-between" alignItems="center" spacing={gridSpacing} sx={{ mb: 0 }}
                                            flexDirection={{ xs: 'column', sm: 'row' }}>
                                            <Grid item sx={{ order: { xs: 2, sm: 1 } }}>
                                                <Typography variant='caption' >{t("add_product")}</Typography>
                                            </Grid>
                                            <Grid item sx={{ order: { xs: 1, sm: 2 } }}>
                                                <ZTitleActionButton onClick={() => {
                                                    queryClient.invalidateQueries(QUERY.ALL_PRODUCT);
                                                    setAddProduct(true)
                                                }}>
                                                    <IconPlus fontSize="inherit" stroke={1.5} size="1.5rem" />
                                                </ZTitleActionButton>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <ZDraggableInvoiceProductList items={items} onDragEnd={onDragEndItem} onChange={handleOnChangeValueItem} onRemove={handleOnRemoveItem} />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Grid container justifyContent="space-between" alignItems="center" spacing={gridSpacing} sx={{ mb: 0 }}
                                            flexDirection={{ xs: 'column', sm: 'row' }}>
                                            <Grid item sx={{ order: { xs: 2, sm: 1 } }}>
                                                <Typography variant='caption' >{t("add_terms")}</Typography>
                                            </Grid>
                                            <Grid item sx={{ order: { xs: 1, sm: 2 } }}>
                                                <ZTitleActionButton onClick={() => {
                                                    queryClient.invalidateQueries(QUERY.ALL_TERMS);
                                                    setAddTerm(true)
                                                }}>
                                                    <IconPlus fontSize="inherit" stroke={1.5} size="1.5rem" />
                                                </ZTitleActionButton>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <ZDraggableTermList items={terms} onDragEnd={onDragEndTerm} onRemove={handleOnRemoveTerm} />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>

                                    <Grid item xs={12} textAlign='right'>
                                        <Button sx={{ mr: 2 }} variant="contained" color="primary" onClick={handleSaveDraft}>{t("save_draft")}</Button>
                                        <Button variant="outlined" color="primary" onClick={() => navigate("../invoice")}>{t("cancel")}</Button>
                                    </Grid>
                                </Grid>
                            </LocalizationProvider>
                        </SubCard>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} textAlign='center'>
                                <Alert severity="info">{t("data_preview_alert")}</Alert>
                                {/* <Button sx={{ mr: 2 }} variant="contained" color="primary" disabled={!valid} onClick={() => { }}>{'Preview'}</Button> */}
                            </Grid>
                            <Grid item xs={12} textAlign='center'>
                                <ZInvoicePreviewSection data={{
                                    orderNumber: orderNumber,
                                    invoiceDate: invoiceDate,
                                    paymentDueDate: paymentDueDate,
                                    deliveryDate: deliveryDate,
                                    company: company,
                                    client: clientShortName && allClients ? Object.values(allClients?.data?.data).filter(o => o.shortname === clientShortName)[0] : null,
                                    items: items,
                                    terms: terms,
                                    status: status
                                }} />
                            </Grid>
                            <Grid item xs={12} textAlign='center'>
                                <Button href="#text-buttons" color='primary' disabled={!enableGenerate} onClick={handlePreviewPDF}>{t("preview_pdf")}</Button>
                                <Button sx={{ ml: 2, mr: 2 }} variant="contained" color="primary" disabled={!enableGenerate} onClick={() => { setOpenConfirmation(true) }}>{t("finalize")}</Button>
                            </Grid>
                        </Grid>

                    </Grid>
                </Grid>
            </MainCard>
        </>

    );
};

export default InvoiceCreateUpdate;
