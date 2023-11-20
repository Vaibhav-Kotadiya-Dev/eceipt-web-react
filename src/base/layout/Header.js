import React from "react";
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, ButtonBase, Typography } from '@mui/material';

// assets
import { IconMenu2 } from '@tabler/icons-react';

// project imports
import config from 'config';
// import colors from 'assets/scss/themes-vars.module.scss';
// import CDLogos from 'assets/CDlogo-small.svg';

// import SearchSection from './SearchSection';
import ProfileSection from './HeaderProfile';
import HeaderNotification from './HeaderNotification';
import { useTenantInfo } from "aas/services/TenantAdminService";
import Image from "mui-image";

import { setPackage } from 'redux/menuReducer';
import HeaderSupport from "./HeaderSupport";
import ChangeLanguage from "base/layout/ChangeLanguage";
// import Logo from "ui-component/Logo";

// ==============================|| MAIN NAVBAR / HEADER ||============================== //
const Header = ({ handleLeftDrawerToggle }) => {
    const dispatch = useDispatch();

    const { data } = useTenantInfo(
        (response) => {
            if (response.code === "SUCCESS") {
                if (response?.data?.subscription === 'BASIC') {
                    dispatch(setPackage({ pkg: 1 }));
                }
            }
        }, () => { })
    const theme = useTheme();
    return (
        <>
            {/* logo & toggler button */}
            <Box sx={{ width: 300, display: 'flex', [theme.breakpoints.down('md')]: { width: 'auto' }, justifyContent: 'center' }}>
                <ButtonBase sx={{ borderRadius: '5px', overflow: 'hidden', paddingLeft: '5px', paddingRight: '5px', marginRight: '10px' }} onClick={handleLeftDrawerToggle} >
                    <IconMenu2 stroke={1.5} size="1.5rem" />
                </ButtonBase>

                {data?.data?.profileImage &&
                    <Box sx={{ display: { xs: 'none', md: 'block' }, mt: 0.5, flexGrow: 1 }}>
                        <Image width={'100%'} height={20} duration={0} alt="Company Logo" easing='initial' fit='contain' src={data?.data?.profileImage} />
                    </Box>}
                <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
                    <ButtonBase disableRipple component={Link} to={config.defaultPath}>
                        <Typography
                            textAlign={'center'}
                            fontSize={20}
                            letterSpacing={1}
                            color={'grey'}
                            fontWeight={'bold'}>
                            {data?.data?.tenantName}
                        </Typography>
                    </ButtonBase>
                </Box>

            </Box>

            <Box sx={{ flexGrow: 1 }} />
            <HeaderSupport sx={{ pr: 2 }} />

            <ChangeLanguage />

            <HeaderNotification />

            <ProfileSection />
        </>
    );

}
export default Header;