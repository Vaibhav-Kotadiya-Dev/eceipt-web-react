// material-ui
import { Grid } from '@mui/material';
// project imports
import { gridSpacing } from 'common/constant';
import OutstandingInvoiceCard from './component/OutstandingInvoiceCard';
import OutstandingDoCard from './component/OutstandingDoCard';
import InventoryCard from './component/InventoryCard';
import InvoiceChartCard from './component/InvoiceChartCard';
import DoChartCard from './component/DoChartCard';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const DashboardOverview = () => {
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item md={8} xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item sm={6} xs={12}>
                                <OutstandingInvoiceCard />
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <OutstandingDoCard />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <InvoiceChartCard />
                    </Grid>

                    <Grid item xs={12}>
                        <DoChartCard />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item md={4} xs={12}>

                <Grid container>
                    <Grid item xs={12}>
                        <InventoryCard />
                    </Grid>
                </Grid>
            </Grid>
        </Grid >
    );
};

export default DashboardOverview;
