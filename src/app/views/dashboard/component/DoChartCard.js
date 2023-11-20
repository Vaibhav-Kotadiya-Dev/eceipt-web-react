import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// material-ui
// import { useTheme } from "@mui/material/styles";
import { Grid, Skeleton, Typography } from '@mui/material';

import ReactApexChart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useGetDoHistory } from 'app/services/dashboard/DashboardService';
import { DoChartDefaultOption } from './ChartDefaultOption';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const DoChartCard = () => {
    // const theme = useTheme()
    const { t } = useTranslation();

    const [series, setSeries] = useState([]);
    const [options, setOptions] = useState({})

    const { isLoading } = useGetDoHistory(
        (response) => {
            if (response.code === "SUCCESS") {
                // console.log(response.data)

                var options = DoChartDefaultOption;
                options.labels = Object.values(response.data).map((v, k) => v.date)
                setOptions(options)

                var chartData = []
                chartData.push({ name: t("order_count"), type: 'column', data: Object.values(response.data).map((v, k) => v.orderCount) })
                setSeries(chartData)
            }
        }, () => { })

    return (
        <>
            <MainCard noPadding>
                <Grid container spacing={0} >
                    <Grid item xs={12} sx={{
                        pt: 3, pl: 3,
                        // background: `linear-gradient(180deg, ${theme.palette.orange.light} 20%, rgba(255,255,255,1) 50%)`,
                    }}>
                        <Typography variant="h4" color="textSecondary">{t("delivery_order_history")}</Typography>
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

export default DoChartCard;