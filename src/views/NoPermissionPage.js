import MainCard from 'ui-component/cards/MainCard';
import { Grid } from '@mui/material';
import { gridSpacing } from 'common/constant';

// ==============================|| Home ||============================== //
const NoPermissionPage = () => {

    return (
        <>
            <MainCard contentSX={{ padding: null }} title="403 Not autherised">
                <Grid container spacing={gridSpacing} justifyContent='center'>

                </Grid>
            </MainCard>

        </>

    );
};

export default NoPermissionPage;
