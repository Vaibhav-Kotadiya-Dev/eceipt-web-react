
import moment from 'moment'

export const InvoiceChartDefaultOption = {
    colors: ['#2196f3', '#2196f3'],  //colors: [theme.palette.primary.main, theme.palette.primary.main],
    chart: {
        height: 350,
        width: '100%',
        type: 'line',
        stacked: false,
        toolbar: { show: false },
        zoom: { enabled: false, },
        // parentHeightOffset: 0,
    },
    grid: { show: false },
    legend: { show: false },
    stroke: {
        width: [0, 0],
        curve: 'smooth'
    },
    plotOptions: { bar: { columnWidth: '50%' } },
    fill: {
        opacity: [0.85, 0.4],
        gradient: {
            inverseColors: false,
            shade: 'light',
            type: "vertical",
            opacityFrom: 0.5,
            opacityTo: 0.55,
            stops: [0, 100]
        }
    },
    labels: [],
    xaxis: {
        type: 'datetime', show: false,
        // labels: { show: false },
        axisBorder: { show: true },
        axisTicks: { show: false },
        labels: {
            show: true,
            rotate: 0,
            // rotateAlways: true,
            hideOverlappingLabels: false,
            // datetimeFormatter: {
            //     year: 'yyyy',
            //     month: "MMM 'yy",
            //     day: 'dd MMM',
            //     hour: 'HH:mm',
            // },
            formatter: function (val) { return moment(val).format('MMM\'YY') }
        }
    },
    yaxis: {
        axisBorder: { show: true },
        shared: false, min: 0, show: true, labels: {
            formatter: function (val) {
                return val.toFixed(0);
            }
        }
    },
    tooltip: {
        shared: true,
        intersect: false,
        y: {
            formatter: function (y, { series, seriesIndex, dataPointIndex, w }) {
                if (seriesIndex === 1) { return "$ " + y; }
                return y;
            }
        }
    },
    responsive: [
        {
            breakpoint: 480,
            options: {
                chart: {
                    height: 200,
                },
                legend: {
                    position: "bottom"
                }
            }
        }
    ]
}


export const DoChartDefaultOption = {
    colors: ['#ffab91', '#ffab91'], //colors: [theme.palette.orange.main, theme.palette.orange.main],
    chart: {
        height: 350,
        width: '100%',
        type: 'line',
        stacked: false,
        toolbar: { show: false },
        zoom: { enabled: false, },

    },
    grid: { show: false },
    legend: { show: false },
    stroke: {
        width: [0, 0],
        curve: 'smooth'
    },
    plotOptions: { bar: { columnWidth: '50%' } },
    fill: {
        opacity: [0.85, 0.4],
        gradient: {
            inverseColors: false,
            shade: 'light',
            type: "vertical",
            opacityFrom: 0.5,
            opacityTo: 0.55,
            stops: [0, 100]
        }
    },
    labels: [],
    xaxis: {
        type: 'datetime', show: false,
        // labels: { show: false },
        axisBorder: { show: true },
        axisTicks: { show: false },
        labels: { formatter: function (val) { return moment(val).format('MMM\'YY') } }
    },
    yaxis: {
        min: 0,
        axisBorder: { show: true }, show: true, labels: {
            formatter: function (val) {
                return val.toFixed(0);
            }
        }
    },
    tooltip: {
        shared: true,
        intersect: false,
        y: {
            formatter: function (y, { series, seriesIndex, dataPointIndex, w }) {
                // if (seriesIndex === 1) { return "$ " + y; }
                return y;
            }
        }
    },
    responsive: [
        {
            breakpoint: 480,
            options: {
                chart: {
                    height: 200,
                },
                legend: {
                    position: "bottom"
                }
            }
        }
    ]
}