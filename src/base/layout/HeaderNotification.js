import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar, Box, ButtonBase, CardActions, Chip, ClickAwayListener, Divider, Grid,
    Paper, Popper, Stack, Typography, useMediaQuery
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/common/Transitions';


// assets
import { IconBell } from '@tabler/icons-react';
import { useDeleteTenantNotification, useTenantNotifications } from 'app/services/NotificationService';
import ZNotificationCardList from 'ui-component/ZNotificationCardList';
import { toast } from 'react-toastify';

// ==============================|| NOTIFICATION ||============================== //

const HeaderNotification = () => {
    const theme = useTheme();
    const { t } = useTranslation();

    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

    const [open, setOpen] = useState(false);

    /**
     * anchorRef is used on different componets and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);

    const { data } = useTenantNotifications(
        (response) => {
            if (response.code !== "SUCCESS") {
                toast.error(response.message)
            }
        }, (error) => { toast.error(error.message) })

    const { mutate: deleteNotifications } = useDeleteTenantNotification(
        (response) => {
            if (response.data.code === "SUCCESS") {
                toast.success(t("record_deleted"))
            } else {
                toast.error(response?.data?.data)
            }
        },
        (error) => {
            toast.error(error.message)
        })

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    const onDeletePressed = (id) => {
        deleteNotifications(id)
    }

    return (
        <>
            <Box sx={{ ml: 2, mr: 0, [theme.breakpoints.down('md')]: { mr: 2 } }}>
                <ButtonBase sx={{ borderRadius: '12px' }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: (data?.data !== null && data?.data?.length > 0) ? theme.palette.warning.dark : theme.palette.primary.light,
                            color: theme.palette.primary.dark,
                            '&[aria-controls="menu-list-grow"],&:hover': {
                                background: theme.palette.primary.dark,
                                color: theme.palette.primary.light
                            }
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                        color="inherit">
                        <IconBell stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
            </Box>
            <Popper
                placement={matchesXs ? 'bottom' : 'bottom-end'}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [matchesXs ? 5 : 0, 20] } }] }}>
                {({ TransitionProps }) => (
                    <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <Grid container direction="column" spacing={2}>
                                        <Grid item xs={12}>
                                            <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                                                <Grid item>
                                                    <Stack direction="row" spacing={2}>
                                                        <Typography variant="subtitle1">{t("all_notification")}</Typography>
                                                        <Chip
                                                            size="small"
                                                            label={data?.data ? data?.data?.length : '0'}
                                                            sx={{
                                                                color: theme.palette.background.default,
                                                                bgcolor: theme.palette.warning.dark
                                                            }}
                                                        />
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <PerfectScrollbar
                                                style={{ height: '100%', maxHeight: 'calc(100vh - 205px)', overflowX: 'hidden' }}
                                            >
                                                <ZNotificationCardList data={data?.data} onDeletePressed={onDeletePressed} />
                                            </PerfectScrollbar>
                                        </Grid>
                                    </Grid>
                                    <Divider />
                                    <CardActions sx={{ p: 1.25, justifyContent: 'center' }}>
                                        {/* <Button size="small" disableElevation>
                                            View All
                                        </Button> */}
                                    </CardActions>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    );
};

export default HeaderNotification;
