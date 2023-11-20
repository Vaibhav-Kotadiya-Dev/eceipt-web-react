import React from "react";
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box, Avatar, ButtonBase, ClickAwayListener, Divider, List, ListItemButton, ListItemIcon, ListItemText, Paper, Popper, Stack, Typography
} from '@mui/material';

// third-party
// import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/common/Transitions';

// assets
import { IconLogout, IconSettings } from '@tabler/icons-react';
// import UserService from "services/UserService";
import AuthService from "aas/services/AuthService";
import { ssun, ssur } from "aas/common/constant";



// ==============================|| PROFILE MENU ||============================== //
const HeaderProfile = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    const anchorRef = useRef(null);
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [name, setName] = useState(false);
    const [role, setRole] = useState(false);

    const authService = new AuthService();

    useEffect(() => {
        setName(localStorage.getItem(ssun));
        setRole(localStorage.getItem(ssur))
    }, [setName, setRole]);

    const handleLogout = async () => {
        authService.logout().then(async (response) => {
            navigate("../login")
        }, error => {
            navigate("../login")
            console.log(error.message);
            //   setErrorMsg("user name / password incorrect")
        })

    };

    const handleClose = (event) => {
        setOpen(false);
    };

    const handleClick = event => {
        if (open) {
            setOpen(false)
        } else {
            setOpen(true)
            // anchorRef = event.target
        }
    };

    return (
        <>
            <Box sx={{ ml: 2, mr: 3, [theme.breakpoints.down('md')]: { mr: 2 } }} >
                <ButtonBase sx={{ borderRadius: '12px' }}>
                    <Avatar
                        aria-describedby={open ? "simple-popper" : null}
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.primary.light,
                            color: theme.palette.primary.dark,
                            '&[aria-controls="menu-list-grow"],&:hover': {
                                background: theme.palette.primary.dark,
                                color: theme.palette.primary.light
                            }
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={(event) => handleClick(event)}
                        color="inherit">
                        <IconSettings stroke={1.5} size="1.5rem" />
                    </Avatar>
                </ButtonBase>
            </Box>
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 14] } }] }}>
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={event => handleClose(event)}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <Box sx={{ paddingX: 2, paddingTop: 2 }}>
                                        <Stack>
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <Typography variant="h4">{t("hi")}, </Typography>
                                                <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                                                    {name}
                                                </Typography>
                                            </Stack>
                                            <Typography variant="subtitle2">{role}</Typography>
                                        </Stack>
                                    </Box>

                                    <Box sx={{ paddingX: 2, paddingBottom: 2 }}>
                                        <Divider />
                                        <List component="nav"
                                            sx={{
                                                width: '100%',
                                                maxWidth: 350,
                                                minWidth: 300,
                                                backgroundColor: theme.palette.background.paper,
                                                borderRadius: '10px',
                                                [theme.breakpoints.down('md')]: {
                                                    minWidth: '100%'
                                                },
                                                '& .MuiListItemButton-root': { mt: 0.5 }
                                            }}>
                                            <ListItemButton
                                                sx={{ borderRadius: `15px` }}
                                                onClick={() => { navigate('../users/profile'); setOpen(false); }}>
                                                <ListItemIcon>
                                                    <IconSettings stroke={1.5} size="1.3rem" />
                                                </ListItemIcon>
                                                <ListItemText primary={<Typography variant="body2">{t("account_settings")}</Typography>} />
                                            </ListItemButton>
                                            <ListItemButton
                                                sx={{ borderRadius: `15px` }}
                                                onClick={handleLogout}>
                                                <ListItemIcon>
                                                    <IconLogout stroke={1.5} size="1.3rem" />
                                                </ListItemIcon>
                                                <ListItemText primary={<Typography variant="body2">{t("logout")}</Typography>} />
                                            </ListItemButton>
                                        </List>
                                    </Box>
                                    {/* </PerfectScrollbar> */}
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    );

}

export default HeaderProfile;