// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItem from 'base/MenuItems';
import { ssur } from 'aas/common/constant';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {

    const userRole = localStorage.getItem(ssur)

    const navItems = menuItem.items.filter(i => userRole !== null && userRole.includes(i.permission)).map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    return <>{navItems}</>;
};

export default MenuList;
