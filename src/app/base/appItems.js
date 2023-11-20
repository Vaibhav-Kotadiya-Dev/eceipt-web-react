import { icons } from 'common/constant';
// import { ROLE_USER } from 'aas/common/constant';
// ==============================|| APP ||============================== //

//config ROLE_USER in parent level
export const appMenuItem = [
    {
        id: 'order-data',
        title: 'orders',
        type: 'collapse',
        collapses: true,
        icon: icons.IconFileInvoice,
        children: [
            {
                id: 'delivery-order',
                title: 'delivery_order',
                type: 'item',
                url: 'do',
                breadcrumbs: true
            },
            {
                id: 'invoice',
                title: 'Invoice',
                type: 'item',
                url: 'invoice',
                breadcrumbs: true
            },
        ]
    },
    {
        id: 'master-data',
        title: 'master_data',
        type: 'collapse',
        collapses: false,
        icon: icons.IconDatabaseCog,
        children: [
            {
                id: 'client',
                title: 'Client',
                type: 'item',
                url: 'master/client',
                breadcrumbs: true
            },
            {
                id: 'product',
                title: 'Product',
                type: 'item',
                url: 'master/product',
                breadcrumbs: true
            },
            {
                id: 'category',
                title: 'Category',
                type: 'item',
                url: 'master/category',
                breadcrumbs: true
            },
            {
                id: 'uom',
                title: 'Uom',
                type: 'item',
                url: 'master/uom',
                breadcrumbs: true
            },

        ]
    },
    {
        id: 'inventory',
        title: 'Inventory',
        type: 'collapse',
        collapses: false,
        package: 1,
        icon: icons.IconBuildingWarehouse,
        children: [
            {
                id: 'product-inv',
                title: 'product_inventory',
                type: 'item',
                url: 'inv/product',
                breadcrumbs: true
            },
            {
                id: 'inv-trans',
                title: 'inventory_transactions',
                type: 'item',
                url: 'inv/trans',
                breadcrumbs: true
            }
        ]
    }
]


//child
export const appDashboardMenuItem = [
    // {
    //     id: 'dashboard-default',
    //     title: 'Dashboard',
    //     type: 'collapse',
    //     collapses: false,
    //     icon: icons.IconDashboard,
    //     children: [
    //         {
    //             id: 'dashboard-main',
    //             title: 'Overview',
    //             type: 'item',
    //             url: 'overview',
    //             breadcrumbs: true
    //         },
    //     ]
    // }
]

//child
export const appAdminMenuItem = [
    {
        id: 'configuration',
        title: 'Configuration',
        type: 'collapse',
        collapses: false,
        icon: icons.IconSettings,
        children: [
            {
                id: 'settings',
                title: 'Settings',
                type: 'item',
                url: 'settings',
                breadcrumbs: false,
                // icon: icons.IconHome,
            },
            {
                id: 'currency',
                title: 'Currency',
                type: 'item',
                url: 'master/currency',
                breadcrumbs: true
            },
            {
                id: 'terms',
                title: 'Terms',
                type: 'item',
                url: 'master/terms',
                breadcrumbs: true
            },
            {
                id: 'termtype',
                title: 'term_type',
                type: 'item',
                url: 'master/termtype',
                breadcrumbs: true
            },
        ]
    },
]


export const appSysAdminMenuItem =
    {
        id: 'app-system-admin',
        title: 'tenant_maintenance',
        type: 'collapse',
        collapses: false,
        icon: icons.IconTool,
        children: [
            {
                id: 'invoice-do-management',
                title: 'invoice_do',
                type: 'item',
                url: 'maint/sysinvdo',
                breadcrumbs: false,
                // icon: icons.IconHome,
            },

        ]
    }

