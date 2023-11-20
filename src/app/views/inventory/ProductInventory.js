import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// material-ui
// import { useTheme } from "@mui/material/styles";
import { Grid, Alert, } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import ZBackdrop from 'ui-component/ZBackdrop';
import ZProductInventoryTableList from './component/ZProductInventoryTableList';
import { gridSpacing } from 'common/constant';
import { useAllProduct } from 'app/services/masters/ProductService';
import { useGetProductInvByCodes } from 'app/services/inventory/ProductInventoryService';
import { toast } from 'react-toastify';



// ==============================|| Product ||============================== //
const ProductInventory = () => {
    // const theme = useTheme()
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [dataLoadingError, setDataLoadingError] = useState(null);
    const [data, setData] = useState(null);
    const [paging, setPaging] = useState();

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState(null);

    const { isFetching } = useAllProduct(
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
        page, pageSize, sortBy
    )

    const { data: prodInvList } = useGetProductInvByCodes(
        (response) => {
            // console.log(response.data)
            // if (response.code === "SUCCESS") {

            // }
        }, (error) => { toast.error(error.message) }, data ? Object.values(data).map(o => o.code) : null
    )


    const handleChangePageSize = (e) => {
        setPageSize(parseInt(e.target.value, 10))
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    };

    const handleSort = (property, order) => {
        setSortBy(property + "," + order)
    };

    const handleOnClickView = async (e) => {
        navigate("../inv/product/view", { state: { id: e.id } })
    }


    return (
        <>
            {(dataLoadingError) && <Alert severity="error" style={{ marginBottom: 10 }}>{t("data_failed_to_load")} {dataLoadingError ?? ''} </Alert>}
            <ZBackdrop open={isFetching} />

            <MainCard contentSX={{ p: 2 }} title={t("manage_product_inventory")}>
                <Grid container spacing={gridSpacing} justifyContent='center'>
                    <Grid item sx={{ width: '100%' }}>
                        {data &&
                            <ZProductInventoryTableList
                                data={Object.values(data).map(o => {
                                    return {
                                        id: o.id,
                                        code: o.code,
                                        name: o.name,
                                        uom: o.uom,
                                        currency: o.currency,
                                        unitprice: o.unitprice,
                                        saftyStockLevel: o.saftyStockLevel
                                    }
                                })}
                                invData={prodInvList}
                                paging={paging}
                                onPageSizeChange={handleChangePageSize}
                                onPageChange={handleChangePage}
                                onSort={handleSort}
                                onClickEdit={handleOnClickView}
                                onClickView={handleOnClickView}
                            />}
                    </Grid>
                </Grid>
            </MainCard >

        </>
    );
};

export default ProductInventory;
