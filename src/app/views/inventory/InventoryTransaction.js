import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';
// material-ui
import { useTheme } from "@mui/material/styles";
import { Grid, Alert, Paper, InputBase, FormControl, Chip, } from '@mui/material';
import { IconSearch, IconX } from '@tabler/icons-react';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import ZBackdrop from 'ui-component/ZBackdrop';
import { gridSpacing } from 'common/constant';
import ZPaginationTable from 'ui-component/ZPaginationTable';
import { useGetAllInventoryTrans } from 'app/services/inventory/InventoryTransactionService';
import { ConvertUTCDateToLocalSimpleDate } from 'common/functions';
import ZTitleActionButton from 'ui-component/ZTitleActionButton';
import SubCard from 'ui-component/cards/SubCard';
import { InvTransType } from 'app/common/InventoryConstant';



// ==============================|| Product ||============================== //
const InventoryTransaction = () => {
    const theme = useTheme()
    const { t } = useTranslation();

    const [dataLoadingError, setDataLoadingError] = useState(null);
    // const [data, setData] = useState(null);
    const [paging, setPaging] = useState();

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy] = useState('lastTransactionDate,desc');

    const [typeFilter, setTypeFilter] = useState('ALL');
    const [productCode, setProductCode] = useState(null);
    const [productCodeFilter, setProductCodeFilter] = useState(null);

    const { data, isFetching } = useGetAllInventoryTrans(
        (response) => {
            if (response.code === "SUCCESS") {
                // setData(response.data.data)
                setPaging(response.data.page)
                setDataLoadingError(null)
            } else {
                setDataLoadingError(response.message)
                // setData(null)
                setPaging(null)
            }
        },
        (error) => {
            setDataLoadingError(error.message)
            // setData(null)
            setPaging(null)
        },
        page, pageSize, sortBy, typeFilter, productCodeFilter
    )

    const handleChangePageSize = (e) => {
        setPageSize(parseInt(e.target.value, 10))
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    };

    const handleProductCodeFilter = async (e) => {
        // e.preventDefault();
        setTypeFilter(null)
        setProductCodeFilter(productCode)
        handleChangePage(0)
    }

    const handleClearFilter = () => {
        setTypeFilter('ALL')
        setProductCode(null)
        setProductCodeFilter(null)
        handleChangePage(0)
    }

    const handleTypeFilter = async (s) => {
        setTypeFilter(s)
        setProductCode(null)
        setProductCodeFilter(null)
        handleChangePage(0)
    }


    return (
        <>
            {(dataLoadingError) && <Alert severity="error" style={{ marginBottom: 10 }}>{t("data_failed_to_load")} {dataLoadingError ?? ''} </Alert>}
            <ZBackdrop open={isFetching} />

            <MainCard contentSX={{ p: 2 }} title={t("inventory_transactions")}>
                <Grid container spacing={gridSpacing} justifyContent='center'>
                    <Grid item xs={12}>
                        <SubCard noPadding sx={{ borderColor: theme.palette.primary.light, color: 'red' }} dividerSX={{ borderColor: theme.palette.grey[200] }} contentSX={{ p: 0 }} >
                            <Grid container sx={{ p: 1, alignItems: 'center' }}>
                                <Grid item sx={{ height: '100%' }} >
                                    <Chip label={t("ALL")}
                                        size="small"
                                        sx={{ backgroundColor: typeFilter === 'ALL' ? theme.palette.primary.main : 'null', color: 'white', mr: 0.5, px: 0.5, '&:hover': { background: theme.palette.primary.main } }}
                                        onClick={() => handleTypeFilter('ALL')} />
                                    {Object.keys(InvTransType).map(s =>
                                        <Chip key={s} label={t(s.toUpperCase())}
                                            size="small"
                                            sx={{ backgroundColor: typeFilter === s.toUpperCase() ? InvTransType[s] : 'null', color: 'white', mr: 0.5, '&:hover': { background: InvTransType[s] } }}
                                            onClick={() => handleTypeFilter(s.toUpperCase())} />)}
                                </Grid>
                                <Grid item sx={{ flex: 1 }}>
                                    <Paper sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                        <InputBase
                                            sx={{ ml: 5, flex: 1 }}
                                            components={FormControl}
                                            value={productCode ?? ''}
                                            placeholder={t("search_product_code")}
                                            onChange={(e) => setProductCode(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleProductCodeFilter()
                                                }
                                            }} />

                                        <ZTitleActionButton onClick={handleProductCodeFilter}>
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
                        {data && paging &&
                            <ZPaginationTable data={Object.values(data?.data?.data).map(trans => {
                                return {
                                    COMPLETED_ON: ConvertUTCDateToLocalSimpleDate(trans.transactedDate),
                                    code: trans?.product?.code,
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
                    </Grid>
                </Grid>
            </MainCard >

        </>
    );
};

export default InventoryTransaction;
