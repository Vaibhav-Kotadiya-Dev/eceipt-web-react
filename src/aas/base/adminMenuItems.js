import { icons } from 'common/constant';
// ==============================|| System Admin Area ||============================== //

export const aasSysAdminMenuItems = [
    {
        id: 'tenant-management',
        title: 'tenant_management',
        type: 'collapse',
        collapses: false,
        icon: icons.IconHomeCog,
        children: [
            {
                id: 'tenant',
                title: 'Tenant',
                type: 'item',
                url: 'sys/tenant-management/tenants',
                breadcrumbs: false
            },
            {
                id: 'users',
                title: 'Users',
                type: 'item',
                url: 'sys/tenant-management/users',
                breadcrumbs: false
            },
        ]
    },
    {
        id: 'api-configuration',
        title: 'api_configuration',
        type: 'collapse',
        collapses: false,
        icon: icons.IconSettings,
        children: [
            {
                id: 'subscription-package',
                title: 'subscription_package',
                type: 'item',
                url: 'sys/config/packages',
                breadcrumbs: true
            },
            {
                id: 'servicegroup',
                title: 'servicegroup',
                type: 'item',
                url: 'sys/config/servicegroup',
                breadcrumbs: true
            },
            {
                id: 'services',
                title: 'Services',
                type: 'item',
                url: 'sys/config/services',
                breadcrumbs: true
            },
        ]
    },
    {
        id: 'scheduler-main',
        title: 'Scheduler',
        type: 'collapse',
        collapses: false,
        icon: icons.IconCalendarTime,
        children: [
            {
                id: 'scheduler',
                title: 'Scheduler',
                type: 'item',
                url: 'sys/scheduler',
                breadcrumbs: false
            },
            {
                id: 'scheduler-log',
                title: 'scheduler_log',
                type: 'item',
                url: 'sys/scheduler/log',
                breadcrumbs: false
            }
        ]
    }
]

//config ROLE_TENANTADMIN in parent level
export const adminMenuItems = {
    id: 'company-management',
    title: 'Company',
    type: 'collapse',
    collapses: false,
    icon: icons.IconBuilding,
    children: [
        {
            id: 't-company-profile',
            title: 'company_profile',
            type: 'item',
            url: 'admin/company/profile',
            breadcrumbs: false,
            // icon: icons.IconHome,

        },
        {
            id: 't-user-management',
            title: 'company_users',
            type: 'item',
            url: 'admin/company/users',
            breadcrumbs: false
        }

    ]
}