import React from "react";

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Drawer, Typography, useMediaQuery } from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';
import { BrowserView, MobileView } from 'react-device-detect';

// project imports
import MenuList from './SidebarMenuList';
import { drawerWidth } from 'common/constant';

// const container = window !== undefined ? () => window.document.body : undefined;

// ==============================|| SIDEBAR DRAWER ||============================== //
export default function Sidebar({ drawerOpen, drawerToggle, window }) {
    const theme = useTheme();
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <Box component="nav" sx={{ flexShrink: { md: 0 }, width: matchUpMd ? drawerWidth : 'auto' }} aria-label="mailbox folders">
            <Drawer
                // container={container}
                variant={matchUpMd ? 'persistent' : 'temporary'}
                anchor="left"
                open={drawerOpen}
                onClose={() => drawerToggle()}
                sx={{
                    width: drawerOpen ? drawerWidth : 0,
                    // flexShrink: 0,
                    // backgroundColor: 'red',
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        background: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        borderRight: 'none',
                        [theme.breakpoints.up('md')]: {
                            top: '60px'
                        }
                    }
                }}
                ModalProps={{ keepMounted: false }}
                color="inherit">

                <BrowserView >
                    <PerfectScrollbar
                        component="div"
                        style={{
                            height: !matchUpMd ? 'calc(100vh - 56px)' : 'calc(100vh - 88px)',
                            paddingLeft: '16px',
                            paddingRight: '16px',

                        }}
                    >
                        <MenuList />
                    </PerfectScrollbar>
                    <Typography variant="subtitle2" target="_blank" underline="hover" sx={{ ml: 1 }}>
                        &copy; expressoom.com  {process.env.REACT_APP_VERSION}
                    </Typography>
                </BrowserView>
                <MobileView>
                    <Box sx={{ px: 2 }}>
                        <MenuList />
                    </Box>
                </MobileView>
            </Drawer>
        </Box>)
}

