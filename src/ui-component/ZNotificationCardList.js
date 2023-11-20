// material-ui
import { useTheme, styled } from '@mui/material/styles';
import {
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    ButtonBase,
    Typography
} from '@mui/material';

// assets
import { IconX, IconInfoCircle } from '@tabler/icons-react';
import { ConvertUTCDateToLocalDate } from 'common/functions';

// styles
const ListItemWrapper = styled('div')(({ theme }) => ({
    padding: 16,
    '&:hover': {
        background: theme.palette.primary.light
    },
    '& .MuiListItem-root': {
        padding: 0
    }
}));

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

const ZNotificationCardList = ({ data, onDeletePressed }) => {
    const theme = useTheme();

    return (
        <List sx={{
            width: '100%',
            maxWidth: 330,
            py: 0,
            borderRadius: '10px',
            [theme.breakpoints.down('md')]: { maxWidth: 300 },
            '& .MuiListItemSecondaryAction-root': { top: 22 },
            '& .MuiDivider-root': { my: 0 },
            '& .list-container': { pl: 4.5 }
        }}
        >
            {data && (
                Object.values(data).map((element, key) => {
                    return (
                        <ListItemWrapper key={key} sx={{ py: 0, px: 1, pb: 1, minWidth: { md: 250, xs: 200 } }}>
                            <ListItem alignItems="center" sx={{ mb: 0 }}>
                                <ListItemIcon><IconInfoCircle stroke={1.5} size="1.5rem" color={element.type === 'INFO' ? theme.palette.primary.dark : theme.palette.error.dark} /></ListItemIcon>
                                <ListItemText sx={{ mb: 0 }} primary={<Typography variant="subtitle1">{element.code}</Typography>} secondary={<Typography variant="caption" display="block" gutterBottom>
                                    {ConvertUTCDateToLocalDate(element.createdDate)}
                                </Typography>} />
                                <ListItemSecondaryAction>
                                    <Grid container justifyContent="flex-end">
                                        <Grid item>
                                            <ButtonBase sx={{ borderRadius: '1px', overflow: 'hidden', paddingLeft: '5px', pr: 0 }}
                                                onClick={() => onDeletePressed(element.id)}>
                                                <IconX stroke={1.5} size="1.5rem" color={'red'} />
                                            </ButtonBase>
                                        </Grid>
                                    </Grid>
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Grid container direction="row" className="list-container">
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2">{element.message}</Typography>
                                </Grid>
                            </Grid>
                            <Divider />
                        </ListItemWrapper>

                    )
                }))}
        </List>
    );
};

export default ZNotificationCardList;
