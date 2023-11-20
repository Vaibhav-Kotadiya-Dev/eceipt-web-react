import MainCard from 'ui-component/cards/MainCard';
import { Grid } from '@mui/material';
import { gridSpacing } from 'common/constant';

// ==============================|| Home ||============================== //
const NotFoundPage = () => {

    return (
        <>
            <MainCard contentSX={{ padding: null }} title="404">
                <Grid container spacing={gridSpacing} justifyContent='center'>
         
                </Grid>
            </MainCard>

        </>

    );
};

export default NotFoundPage;
