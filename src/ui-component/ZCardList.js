import { useState } from 'react';
// import { useTheme } from '@mui/material/styles';
// material-ui
import { CardContent, Grid, Typography, Button } from '@mui/material';
import MainCard from './cards/MainCard';
// import Skeleton from '@mui/material/Skeleton';

const ZCardList = ({ data, onChangeSel, title }) => {
    const [sel, setSel] = useState(null);

    const handleSel = (val) => {
        setSel(val)
        onChangeSel(val)
    };

    return (
        <MainCard noPadding sx={{ pl: 0, pr: 0, pt: 0, pb: 0 }} contentSX={{ padding: 0 }} >
            <CardContent >
                <Typography color="text.secondary" gutterBottom textAlign={'center'}>
                    {title}
                </Typography>
                {data && (
                    Object.values(data).map((element, key) => {
                        return <Button
                            fullWidth
                            key={key}
                            disableElevation
                            variant={sel === element.name ? 'contained' : 'outlined'}
                            // size="small"
                            sx={{ color: sel === element.name ? 'white' : 'inherit', mb: 1 }}
                            onClick={(e) => handleSel(element.code)}>

                            <Grid container alignItems='center'>
                                <Grid item md={12}>
                                    <Typography sx={{ fontSize: 14, fontWeight: 'bold' }}> {element.name} </Typography>
                                </Grid>
                                {/* <Grid item md={12}>
                                    <Typography sx={{ fontSize: 12 }} textAlign={'start'}> {element.description} {element.priority} </Typography>
                                </Grid> */}
                            </Grid>
                        </Button>
                    })
                )}
            </CardContent>


            {/* <Skeleton variant="rectangular" height={30} /> */}
        </MainCard >)
}

export default ZCardList;
