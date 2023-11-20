import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';

// material-ui
// import { useTheme } from "@mui/material/styles";
import { Grid, Alert } from '@mui/material';

import { IconPlus } from '@tabler/icons-react';
import { toast } from 'react-toastify';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'common/constant';

import ZTitleActionButton from 'ui-component/ZTitleActionButton';
import SubCard from 'ui-component/cards/SubCard';
import { useFindProductById } from 'app/services/masters/ProductService';
import ZTextWithTitle from 'ui-component/ZTextWithTitle';
import { useGetProductInvByCode } from 'app/services/inventory/ProductInventoryService';
import { useAdjustInventory, useGetInventoryTransByCode } from 'app/services/inventory/InventoryTransactionService';
import ZAdjustInventoryDialog from './component/ZAdjustInventoryDialog';
import { ssun } from 'aas/common/constant';
import { ConvertUTCDateToLocalSimpleDate } from 'common/functions';
import ZPaginationTable from 'ui-component/ZPaginationTable';


// ==============================|| Product ||============================== //
const ProductInventoryView = () => {
    // const theme = useTheme()
    // const navigate = useNavigate();
    const { t } = useTranslation();

    const location = useLocation();
    const [dataLoadingError, setDataLoadingError] = useState(null);

    const [invAdjDialog, setInvAdjDialog] = useState(false);

    const [id, setId] = useState(null);

    const [paging, setPaging] = useState();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        // console.log(location?.state?.id)
        if (location.state != null && location.state.id != null) {
            setId(location.state.id)
        }
    }, [location, setId]);

    // Queries =====================================================================================================
    const { data: currentProduct } = useFindProductById(
        (response) => {
            // console.log(response.data)
            if (response.code === "SUCCESS") {
                setDataLoadingError(null)
            } else {
                setDataLoadingError(response.data.message)
            }
        }, (error) => { setDataLoadingError(error.message) }, id
    )

    const { data: currentProductInventory } = useGetProductInvByCode(
        (response) => {
            // console.log(response.data)
            if (response.code === "SUCCESS") {

            }
        }, (error) => { toast.error(error.message) }, currentProduct?.data?.code
    )

    const { mutate: adjustInventory } = useAdjustInventory(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success(t("transaction_added"))
                setInvAdjDialog(false)
            } else {
                toast.error(response.data.message)
            }
        }, (error) => { toast.error(error.message) })

    const { data: invTrans } = useGetInventoryTransByCode(
        (response) => {
            if (response.code === "SUCCESS") {
                setPaging(response.data.page)
                // setDataLoadingError(null)
            } else {
                // setDataLoadingError(response.message)
                setPaging(null)
            }
        },
        (error) => {
            // setDataLoadingError(error.message)
            setPaging(null)
        },
        page, pageSize, null, currentProduct?.data?.code
    )
    // Queries =====================================================================================================
    const handleChangePageSize = (e) => {
        setPageSize(parseInt(e.target.value, 10))
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    };

    const handleClickOk = async (obj) => {
        console.log(obj)

        await adjustInventory({
            movement: obj.movement,
            product: currentProduct?.data,
            quantity: obj.quantity,
            remarks: obj.remarks,
            createdBy: localStorage.getItem(ssun)
        })
    }


    return (
        <>
            {(dataLoadingError) && <Alert severity="error" style={{ marginBottom: 10 }}>{t("data_failed_to_load")} {dataLoadingError ?? ''} </Alert>}
            {/* <ZBackdrop open={isFetching || createLoading || updateLoading || deleteLoading} /> */}

            {/* <ZPromptConfirmation open={remove}
                fullWidth
                title={"Please confirm"}
                text={'You are about to delete a record, please confirm.'}
                deleteButtonText={'Remove'}
                enableCancel={true}
                onClickDelete={handleRemove}
                onClickCancel={() => { setRemove(false) }}
            /> */}
            <ZAdjustInventoryDialog
                open={invAdjDialog}
                product={currentProduct?.data}
                onClickOk={handleClickOk}
                onClickCancel={() => setInvAdjDialog(false)}
            />

            <Grid container spacing={gridSpacing} justifyContent='center'>
                <Grid item xs={12} >
                    <MainCard contentSX={{ p: 2 }} title={t("view_product_inventory")}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item md={3} xs={6}>
                                <ZTextWithTitle
                                    title={t("code")} titleToolTips={''}
                                    text={currentProduct?.data?.code} textToolTips={''} />
                            </Grid>
                            <Grid item md={3} xs={6}>
                                <ZTextWithTitle
                                    title={t("name")} titleToolTips={''}
                                    text={currentProduct?.data?.name} textToolTips={''} />
                            </Grid>
                            <Grid item md={6} xs={6}>
                                <ZTextWithTitle
                                    title={t("description")} titleToolTips={''}
                                    text={currentProduct?.data?.description} textToolTips={''} />
                            </Grid>
                            <Grid item md={3} xs={6}>
                                <ZTextWithTitle
                                    title={t("category")} titleToolTips={''}
                                    text={currentProduct?.data?.category} textToolTips={''} />
                            </Grid>
                            <Grid item md={3} xs={6}>
                                <ZTextWithTitle
                                    title={t("unitprice")} titleToolTips={''}
                                    text={currentProduct?.data?.currency + ' ' + currentProduct?.data?.unitprice} textToolTips={''} />
                            </Grid>
                            <Grid item md={3} xs={6}>
                                <ZTextWithTitle
                                    title={t("uom")} titleToolTips={''}
                                    text={currentProduct?.data?.uom} textToolTips={''} />
                            </Grid>
                            <Grid item md={3} xs={6}>
                                <ZTextWithTitle
                                    title={t("saftystocklevel")} titleToolTips={''}
                                    text={currentProduct?.data?.saftyStockLevel} textToolTips={''} />
                            </Grid>
                        </Grid>
                    </MainCard >
                </Grid>

                <Grid item xs={12} >
                    <MainCard contentSX={{ p: 2 }} title={t("product_inventory")}
                        secondary={
                            <ZTitleActionButton onClick={() => setInvAdjDialog(true)}>
                                <IconPlus fontSize="inherit" stroke={1.5} size="1.5rem" />
                            </ZTitleActionButton>}>
                        <Grid container spacing={gridSpacing} justifyContent='center'>
                            <Grid item xs={12} >
                                <SubCard>
                                    <Grid container spacing={gridSpacing}>
                                        <Grid item md={3} xs={6}>
                                            <ZTextWithTitle
                                                title={t("onhand")} titleToolTips={''}
                                                text={currentProductInventory?.data?.onHand} textToolTips={''} />
                                        </Grid>

                                        <Grid item md={3} xs={6}>
                                            <ZTextWithTitle
                                                title={t("in_transit")} titleToolTips={''}
                                                text={currentProductInventory?.data?.inTransit} textToolTips={''} />
                                        </Grid>
                                        <Grid item md={3} xs={6}>
                                            <ZTextWithTitle
                                                title={t("reserved")} titleToolTips={''}
                                                text={currentProductInventory?.data?.reserved} textToolTips={''} />
                                        </Grid>
                                    </Grid>
                                </SubCard>
                            </Grid>

                            <Grid item xs={12} >
                                <SubCard title={t("inventory_transactions")}>
                                    {invTrans &&
                                        <ZPaginationTable data={Object.values(invTrans?.data?.data).map(trans => {
                                            return {
                                                date: ConvertUTCDateToLocalSimpleDate(trans.transactedDate),
                                                type: trans.type,
                                                movement: trans.movement,
                                                quantity: trans.quantity,
                                                invoice: trans.invoiceNumber,
                                                do: trans.deliveryOrderNumber,
                                                remarks: trans.remarks,
                                                by: trans.createdBy,
                                                status: trans.status,
                                            }
                                        })}
                                            sort={false}
                                            paging={paging}
                                            onPageSizeChange={handleChangePageSize}
                                            onPageChange={handleChangePage}
                                        />}

                                </SubCard>
                            </Grid>
                        </Grid>
                    </MainCard >
                </Grid>
            </Grid>
        </>
    );
};

export default ProductInventoryView;
