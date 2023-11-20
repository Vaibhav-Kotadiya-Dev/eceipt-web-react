import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';

// material-ui
import { useTheme } from "@mui/material/styles";
import { Alert, Button, Divider, Grid, MenuItem, TextField, Typography } from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { IconPlus } from '@tabler/icons-react';

// project imports
import { gridSpacing } from 'common/constant';
import MainCard from 'ui-component/cards/MainCard';

import SubCard from 'ui-component/cards/SubCard';
import ZTitleActionButton from 'ui-component/ZTitleActionButton';
import ZBackdrop from 'ui-component/ZBackdrop';

import ZPromptConfirmation from 'ui-component/ZPromptConfirmation';
import ZAddProductDialog from '../component/ZAddProductDialog';
import ZAddTermDialog from '../component/ZAddTermDialog';
import ZDraggableTermList from '../component/ZDraggableTermList';
import ZDoPreviewSection from '../component/ZDoPreviewSection';
import ZDraggableDoProductList from '../component/ZDraggableDoProductList';
import { useFinalize, useGetById, useGetDoByInvoiceNumber, useSave, usePreviewPDF } from 'app/services/orders/DeliveryOrderService';
import { useGetInvoiceByOrderNumber, useGetInvoiceNumberList, useQueryInvoiceByOrderNumber } from 'app/services/orders/InvoiceService';
import { useAllClientNoPaging } from 'app/services/masters/ClientService';
import { useTenantInfo } from 'aas/services/TenantAdminService';
import { QUERY } from 'aas/common/constant';
import ZDoInvoiceCheckDialog from '../component/ZDoInvoiceCheckDialog';
import { API_URL } from "../../../../config";
import ZPDFViewDialog from "../component/ZPDFViewDialog";

// 1. pass invoice number over to do screen --done
// 2. retrieve invoice detail --done
// 3. in finalise check, ensure item not more than what's in invoice, need consider do with same invoice number --done
// 4. create get invoice list api for drop down, get all invoice that not draft and cancel --done
// 5. put invoice number on screen -- done
// 6. do error prompt
// 7. change linked invoice -- done


// ==============================|| DoCreateUpdate ||============================== //
const DoCreateUpdate = () => {
    const inputDate = new Date().toLocaleDateString();
    const parts = inputDate.split('/');
    const reformattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
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

    //use by copy from invoice
    const [invoice, setInvoice] = useState(null);
    const [invoiceNumber, setInvoiceNumber] = useState(null);
    const [doInvoiceCheckDialogOpen, setDoInvoiceCheckDialogOpen] = useState(false);

    const [id, setId] = useState(null);
    const [orderNumber, setOrderNumber] = useState(null);
    const [deliveryDate, setDeliveryDate] = useState(dayjs(reformattedDate));
    const [clientShortName, setClientShortName] = useState(null);
    const [company, setCompany] = useState(null);
    const [items, setItems] = useState([]);
    const [terms, setTerms] = useState([]);
    const [status, setStatus] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [openPdfViewer, setOpenPdfViewer] = useState(false);

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

    const { data: allClients } = useAllClientNoPaging(
        (response) => {
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

    const { data: invoiceNumberList, isLoading: invoiceNumberListLoading } = useGetInvoiceNumberList(
        (response) => {
            if (response.code === "SUCCESS") {
                setDataLoadingError(null)
            } else {
                setDataLoadingError(t("loading_existing_open_invoice") + ":", response.message)
            }
        }, (error) => { toast.error(error.message) })

    const { mutate: getDo, isLoading: getDoLoading } = useGetById(
        (response) => {
            // console.log(response.data.data)
            if (response.data.code === "SUCCESS") {
                setDoData(response.data.data)
            } else {
                toast.error(response.data.message)
            }
        }, (error) => { toast.error(error.message) })

    const { data: doLinkedWithInvoice, isLoading: getDoLinkedWithInvoiceLoading } = useGetDoByInvoiceNumber(
        (response) => {
            if (response.data.code === "SUCCESS") {
                // setdoLinkedWithInvoice(response.data.data)
            } else {
                toast.error(response.data.message)
            }
        }, (error) => { toast.error(error.message) }, invoiceNumber)

    const { isLoading: getLinkedInvoiceLoading } = useQueryInvoiceByOrderNumber(
        (response) => {
            if (response.code === "SUCCESS") {
                setInvoice(response.data)
                setInvoiceNumber(response.data.orderNumber)
            } else {
                toast.error(response.data.message)
            }
        }, (error) => { toast.error(error.message) }, invoiceNumber)

    //use one time, that's why use mutation.
    const { mutate: loadSourceInvoiceData, isLoading: getSourceInvoiceDataLoading } = useGetInvoiceByOrderNumber(
        (response) => {
            if (response.data.code === "SUCCESS") {
                copyInvoiceDataToDo(response.data.data) //relocate
            } else {
                toast.error(response.data.message)
            }
        }, (error) => { toast.error(error.message) })

    const { mutate: finalize, isLoading: finalizeLoading } = useFinalize(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success(t("do_saved"))
                navigate("../do")

            } else {
                toast.error(response.data.message)
            }
        }, (error) => {
            setEnableGenerate(false)
            toast.error(error.message)
        })

    const { mutate: createObj, isLoading: createLoading } = useSave(
        (response) => {
            if (response.data.code === "SUCCESS") {
                getDo(response.data.data.id) //save and reload data
                setEnableGenerate(true)
                toast.success(t("do_saved"))
            } else {
                setEnableGenerate(false)
                toast.error(response.data.message)
            }
        }, (error) => {
            setEnableGenerate(false)
            toast.error(error.message)
        })

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


    useEffect(() => {
        if (location.state != null && location.state.id != null) { //when edit, will pass id from list
            // setId(location.state.id)
            getDo(location.state.id)
        }

        if (location.state != null && location.state.invoiceNumber != null) { // when copy, will pass invoice number from invoice view screen
            loadSourceInvoiceData(location.state.invoiceNumber)
        }
    }, [location, setId, getDo, loadSourceInvoiceData]);

    const setDoData = (data) => {
        const doDate = new Date(data.deliveryDate).toLocaleDateString();
        const doParts = doDate.split('/');
        const doReformattedDate = `${doParts[2]}-${doParts[1]}-${doParts[0]}`;
        setId(data.id)
        setInvoiceNumber(data.invoiceNumber)
        setOrderNumber(data.orderNumber)
        setDeliveryDate(dayjs(doReformattedDate))
        setClientShortName(data.clients[0].shortname)
        setStatus(data.status)

        Object.values(data.items).forEach(i => { i.key = i.id }) //key is for draggable list
        Object.values(data.terms).forEach(t => { t.key = t.id })

        setItems(data.items)
        setTerms(data.terms)
    }

    const copyInvoiceDataToDo = (data) => {
        setInvoice(data)
        //id used to identify if item is new, set to null to treat as new
        Object.values(data.items).forEach(i => i.id = null)
        Object.values(data.terms).forEach(t => t.id = null)

        setInvoiceNumber(data.orderNumber)
        setClientShortName(data.clientName)
        setItems(data.items)
        setTerms(data.terms)
    }

    const validateInvoiceDoQty = async () => {
        if (invoiceNumber === null || invoiceNumber === '') {
            return true;
        } else {
            //put inv qty to list, no duplicate
            var invoiceItems = []
            Object.values(invoice.items).forEach((v) => { invoiceItems[v.code] = invoiceItems.hasOwnProperty(v.code) ? invoiceItems[v.code] + v.quantity : v.quantity; })

            //put all do qty to list including current
            var doItems = []
            Object.values(items).forEach((v) => { doItems[v.code] = doItems.hasOwnProperty(v.code) ? doItems[v.code] + v.quantity : v.quantity; })
            Object.values(doLinkedWithInvoice?.data).filter(d => d.orderNumber !== orderNumber).forEach((v) => {
                Object.values(v.items).forEach(i => {
                    doItems[i.code] = doItems.hasOwnProperty(i.code) ? doItems[i.code] + i.quantity : i.quantity;
                })
            })

            //check if do quantity more than invoice quantity

            // Old Code
            // Object.keys(doItems).forEach((k) => {
            //     if (!invoiceItems.hasOwnProperty(k)) {
            //         console.log('hasOwnProperty', false)
            //         return false
            //     } else {
            //         console.log(k, doItems[k], invoiceItems[k])
            //         if (invoiceItems[k] < doItems[k]) {
            //             console.log('value', false)
            //             return false
            //         }
            //     }
            // })

            // console.log('DO Item', doItems)
            // console.log('invoice Items', invoiceItems)

            // Optimised Code
            var validator = Object.keys(doItems).filter(k => {
                // console.log(!invoiceItems.hasOwnProperty(k) )
                // console.log(!invoiceItems.hasOwnProperty(k) )
                // console.log((invoiceItems.hasOwnProperty(k) && invoiceItems[k] < doItems[k]) )

                return !invoiceItems.hasOwnProperty(k) || (invoiceItems.hasOwnProperty(k) && invoiceItems[k] < doItems[k])
            })

            return validator.length === 0;
        }
    }

    const validate = async () => {
        var flag = 1
        if (deliveryDate === null) {
            flag = 0;
        }
        if (clientShortName === null) {
            flag = 0;
        }
        if (items.length === 0 || terms.length === 0) {
            flag = 0;
        }

        Object.values(items).forEach(i => {
            // console.log(i.quantity, i.unitprice, (i.quantity === null || i.quantity === undefined || i.quantity === 0 || i.unitprice === 0))
            if (i.quantity === null || i.quantity === undefined || i.quantity === 0 || i.unitprice === 0) {
                flag = 0;
            }
        })

        var doInvoiceMatch = await validateInvoiceDoQty();
        if (!doInvoiceMatch) {
            flag = 2;
        }

        return flag
    }

    const handleSaveDraft = async () => {
        var validationResult = await validate()

        if (validationResult === 2) {
            // toast.error("Delivery Order Quantity is more than invoice quantity, please check linked delivery order"); //change to dialog
            setDoInvoiceCheckDialogOpen(true)
            return
        }

        if (validationResult !== 1) {
            toast.error(t("fill_all_field_warning"));
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

        var order = {
            id: id,
            invoiceNumber: invoiceNumber,
            orderNumber: orderNumber,
            deliveryDate: new Date(deliveryDate).getTime(),
            clientName: client.name,
            company: company,
            totalProduct: totalProduct.length,
            totalQuantity: totalQuantity,
            totalPrice: totalPrice,
            items: items,
            clients: [client],
            terms: terms,
            withInvTrans: true
        }

        await createObj(order)
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

    const finalizeOrder = async () => {
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
            <ZBackdrop open={createLoading || finalizeLoading || getDoLinkedWithInvoiceLoading || getDoLoading || getSourceInvoiceDataLoading || invoiceNumberListLoading || getLinkedInvoiceLoading || getPDFLoading} />
            <ZPDFViewDialog open={openPdfViewer} height={document.body.clientHeight} pdfUrl={pdfUrl} onClickClose={handleClosePDFViewer} />
            <ZAddProductDialog open={addProduct} onClickAdd={handleClickAddProduct} onClickCancel={() => setAddProduct(false)} />
            <ZAddTermDialog open={addTerm} onClickAdd={handleClickAddTerm} onClickCancel={() => setAddTerm(false)} />
            <ZDoInvoiceCheckDialog open={doInvoiceCheckDialogOpen} onClickOk={() => setDoInvoiceCheckDialogOpen(false)}
                invoiceData={invoice}
                currentDo={{ orderNumber: orderNumber, items: items }}
                previousDo={doLinkedWithInvoice?.data}
            />

            <ZPromptConfirmation open={openConfirmation}
                fullWidth
                title={t("please_confirm")}
                text={<>
                    <Typography sx={{ pb: 1 }}>{t("finalise_do_message")}</Typography>
                    <Typography color={theme.palette.error.dark}>{t("generate_order_number_message")}</Typography>
                </>}
                confirmButtonText={t("finalize")}
                onClickConfirm={finalizeOrder}
                enableCancel={true}
                onClickCancel={() => { setOpenConfirmation(false) }}
            />

            <MainCard contentSX={{}} title={t("create_delivery_order")} secondary={<>
                {/* {status && <Chip label={status} variant={'outlined'} color="primary" size="small" sx={{ ml: 1 }} />} */}
            </>
            }>
                <Grid container spacing={gridSpacing}>
                    <Grid item md={6} xs={12}>
                        <SubCard sx={{ borderColor: theme.palette.grey[200] }} dividerSX={{ borderColor: theme.palette.grey[200] }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid container spacing={gridSpacing}>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            select
                                            label={t("linked_invoice_number")}
                                            value={invoiceNumber ?? ""}
                                            onChange={(e) => setInvoiceNumber(e.target.value)}
                                            SelectProps={{}}>
                                            <MenuItem key={''} value={''}>{t("none")}</MenuItem>
                                            {!invoiceNumberList?.data && invoiceNumber && <MenuItem key={''} value={invoiceNumber} style={{ display: "none" }}>{t("none")}</MenuItem>}
                                            {invoiceNumberList?.data && Object.values(invoiceNumberList?.data).map((v, k) =>
                                                <MenuItem key={k} value={v}>
                                                    {v}
                                                </MenuItem>)}
                                        </TextField>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>


                                    {orderNumber &&
                                        <Grid item xs={12}>
                                            <Typography display="inline" variant='caption' align='left'>{t("order_number") + ' : '}</Typography>
                                            <Typography display="inline" variant='h4' align='left'>{orderNumber}</Typography>
                                        </Grid>}
                                    <Grid item md={6} xs={12}>
                                        <DatePicker
                                            sx={{ width: '100%' }}
                                            label={t("delivery_date")}
                                            value={deliveryDate}
                                            onChange={(value) => setDeliveryDate(value)} />
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
                                        <ZDraggableDoProductList items={items} onDragEnd={onDragEndItem} onChange={handleOnChangeValueItem} onRemove={handleOnRemoveItem} />
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
                                        <Button variant="outlined" color="primary" onClick={() => navigate("../do")}>{t("cancel")}</Button>
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
                                <ZDoPreviewSection data={{
                                    orderNumber: orderNumber,
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

export default DoCreateUpdate;
