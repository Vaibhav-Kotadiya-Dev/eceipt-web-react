// assets
import { icons } from 'common/constant';
import { ROLE_SYSADMIN, ROLE_TENANTADMIN, ROLE_USER } from 'aas/common/constant';
import { adminMenuItems, aasSysAdminMenuItems } from 'aas/base/adminMenuItems';
import { appMenuItem, appAdminMenuItem, appDashboardMenuItem, appSysAdminMenuItem } from 'app/base/appItems';
// ==============================|| DASHBOARD MENU ITEMS ||============================== //


const home = {
    id: 'dashboard',
    title: 'dashboard',
    type: 'group',
    permission: ROLE_USER,
    children: [
        {
            id: 'home',
            title: 'home',
            type: 'item',
            url: 'home',
            breadcrumbs: true,
            icon: icons.IconHome,
        },
        ...appDashboardMenuItem
    ]
};

// ==============================|| APP MENU ITEMS ||============================== //
const appMenu = {
    id: 'data',
    title: 'data',
    type: 'group',
    permission: ROLE_USER,
    children: [
        ...appMenuItem
    ]
};

// ==============================|| Tenant Admin Area ||============================== //
const tenantadmin = {
    id: 'tenantadmin',
    title: 'admin_area',
    type: 'group',
    permission: ROLE_TENANTADMIN,
    children: [
        ...appAdminMenuItem,
        adminMenuItems,
    ]
};

const sysAdminMenuItems = {
    id: 'administrative',
    title: 'system_admin_area',
    type: 'group',
    permission: ROLE_SYSADMIN,
    children: [
        appSysAdminMenuItem,
        ...aasSysAdminMenuItems
    ]
};

const menuItems = {
    items: [home, appMenu, tenantadmin, sysAdminMenuItems]
};

export default menuItems;
