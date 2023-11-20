import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// material-ui
import { useTheme, styled } from "@mui/material/styles";
import { Chip, Grid, Skeleton, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useGetOutstandingDo, useGetOverdueDo } from "app/services/dashboard/DashboardService";

// ==============================|| DEFAULT DASHBOARD ||============================== //
const CardWrapper = styled(Grid)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 12,
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${theme.palette.orange.main} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -18,
        right: -150
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${theme.palette.orange.main} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
        borderRadius: '50%',
        top: -160,
        right: -100
    }
}));

const OutstandingDoCard = () => {
    const theme = useTheme()
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { isLoading: loadingOutstanding, data: outstanding } = useGetOutstandingDo(
        (response) => {
        }, () => { })

    const { isLoading: loadingOverdue, data: overdue } = useGetOverdueDo(
        (response) => {
        }, () => { })

    return (
        <>
            <CardWrapper >
                <MainCard>
                    {loadingOutstanding || loadingOverdue ?
                        <Grid container direction={'column'} spacing={'gridSpacing'}>
                            <Skeleton variant="rectangular" height={55} />
                        </Grid>
                        :
                        <Grid container direction={'column'} spacing={'gridSpacing'}>
                            <Grid item>
                                <Typography variant="h5" color="textSecondary">{t("outstanding_delivery_order")}</Typography>
                            </Grid>
                            <Grid item sx={{ pt: 1 }}>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <Typography variant="h2" color={theme.palette.primary.dark} display={'inline'}>
                                            {outstanding?.data[0].orderCount ?? 0}
                                        </Typography>

                                        <Typography variant="caption" color="textSecondary" display={'inline'} sx={{ pl: 1 }}>
                                            {t('delivery_order') + ' '}
                                        </Typography>
                                    </Grid>
                                    {overdue?.data[0].orderCount > 0 && (
                                        <Grid item>
                                            <Chip variant='filled' color={'error'} size="small"
                                                // icon={<IconAlertCircle color='coral' size="1rem" />}
                                                sx={{ ml: 1, p: 1, py: 1.25, borderRadius: 2 }}
                                                label={<><b>{overdue?.data[0].orderCount}</b> {t('overdue')}</>}
                                                onClick={() => navigate("../do")}
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    }
                </MainCard>
            </CardWrapper>

        </>
    );
};

export default OutstandingDoCard;
