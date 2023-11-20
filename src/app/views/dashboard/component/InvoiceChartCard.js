import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// material-ui
// import { useTheme } from "@mui/material/styles";
import { Grid, Skeleton, Typography } from '@mui/material';

import ReactApexChart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { InvoiceChartDefaultOption } from './ChartDefaultOption';
import { useGetInvoiceHistory } from 'app/services/dashboard/DashboardService';

// ==============================|| DEFAULT DASHBOARD ||============================== //
const InvoiceChartCard = () => {
    // const theme = useTheme()
    const { t } = useTranslation();

    const [series, setSeries] = useState([]);
    const [options, setOptions] = useState({})

    const { isLoading } = useGetInvoiceHistory(
        (response) => {
            if (response.code === "SUCCESS") {
                // console.log(response.data)

                var options = InvoiceChartDefaultOption;
                options.labels = Object.values(response.data).map((v, k) => v.date)
                setOptions(options)

                var chartData = []
                chartData.push({ name: t("order_count"), type: 'column', data: Object.values(response.data).map((v, k) => v.orderCount) })
                chartData.push({ name: t("order_amount"), type: 'area', data: Object.values(response.data).map((v, k) => v.orderAmount) })
                setSeries(chartData)
            }
        }, () => { })

    return (
        <>
            <MainCard noPadding>
                <Grid container spacing={0}>
                    <Grid item xs={12} sx={{
                        pt: 3, pl: 3,
                        // background: `linear-gradient(180deg, ${theme.palette.primary[200]} -40%, rgba(255,255,255,1) 50%)`,
                    }}>
                        <Typography variant="h4" color="textSecondary">{t("invoice_history")}</Typography>
                    </Grid>
                    {isLoading ?
                        <Grid item xs={12} sx={{ mr: 1 }}>
                            <Skeleton variant="rectangular" height={300} />
                        </Grid>
                        :
                        <Grid item xs={12} sx={{ mr: 1 }}>
                            {options && series && <ReactApexChart options={options} series={series} type="line" height={350} />}
                        </Grid>
                    }
                </Grid>
            </MainCard>
        </>
    );
};

export default InvoiceChartCard;