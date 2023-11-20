import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// material-ui
import { useTheme } from "@mui/material/styles";
import { Divider, Grid, Skeleton, Typography } from '@mui/material';

import ReactApexChart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useGetInventoryStatus, useGetLowInventoryList } from 'app/services/dashboard/DashboardService';
import BasicTableSmall from 'ui-component/BasicTableSmall';
import { translate } from 'common/functions';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const InventoryCard = () => {
    const theme = useTheme()
    const { t } = useTranslation();

    const [series, setSeries] = useState([1, 0, 0]);
    // const [invList, setInvList] = useState(null);

    const [options] = useState({
        // colors: ['#46bcc4', '#ffbf00', theme.palette.error.light],
        colors: [theme.palette.success.main, theme.palette.primary.main, theme.palette.error.dark],
        fill: {
            opacity: [0.3, 0.2, 0.5],
        },
        chart: {
            width: '100%',
            type: 'pie',
        },
        labels: [t('normal'), t('low'), t('nostock')],
        stroke: { width: 0, },
        plotOptions: {
            pie: {
                dataLabels: {
                    offset: -15,
                }
            }
        },
        dataLabels: {
            style: {
                fontSize: '14px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 'bold',
                colors: undefined
            },
            formatter(val, opts) {
                const name = opts.w.globals.labels[opts.seriesIndex]
                return [name, val.toFixed(1)]
            },
            dropShadow: {
                enabled: false,

            }
        },
        legend: { show: false, position: 'bottom' },
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: function (y, { series, seriesIndex, dataPointIndex, w }) {
                    return y + ' ' + t('product');
                }
            }
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 280,
                        alignItems: 'center'
                    },
                    legend: {
                        position: "bottom"
                    }
                }
            }
        ]

    })

    const { isLoading } = useGetInventoryStatus(
        (response) => {
            if (response.code === "SUCCESS") {
                var data = []
                Object.values(response.data[0]).forEach(o => data.push(o))
                // console.log(data)
                setSeries(data)
            }
        }, () => { })

    const { data: invList } = useGetLowInventoryList(
        (response) => {
        }, () => { })

    return (
        <>
            <MainCard noPadding>
                <Grid container spacing={0}>
                    <Grid item xs={12} sx={{ pt: 3, pl: 3, pb: 2 }}>
                        <Typography variant="h4" color="textSecondary">{t('inventory')}</Typography>
                    </Grid>
                    <Grid item xs={12} alignContent={'center'} alignItems={'center'} >
                        {isLoading ?
                            <Grid item xs={12}>
                                <Skeleton variant="rectangular" height={150} />
                            </Grid>
                            :
                            <Grid item xs={12} textAlign={'center'} sx={{ display: 'flex', justifyContent: 'center' }}>
                                {options && series && <ReactApexChart options={options} series={series} type="pie" />}
                            </Grid>
                        }

                    </Grid>
                    <Grid item xs={12} sx={{ pb: 1 }}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12} sx={{ mx: 1 }}>
                        {invList &&
                            <BasicTableSmall dense={'small'} data={Object.values(invList?.data).map(o => {
                                return {
                                    code: o.code,
                                    'on hand': o.on_hand ?? 0,
                                    status: translate(o.status.toLowerCase())
                                }
                            })} />}
                    </Grid>
                </Grid>
            </MainCard>
        </>
    );
};

export default InventoryCard;