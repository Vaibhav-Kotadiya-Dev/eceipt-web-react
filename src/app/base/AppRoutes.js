import { lazy } from 'react';

// project imports
import MainLayout from 'base/layout/MainLayout';
import Loadable from 'ui-component/common/Loadable';
import ZPromptLoginExpired from 'ui-component/ZPromptLoginExpired';

//users
// const DashboardOverview = Loadable(lazy(() => import('app/views/dashboard/DashboardOverview')));
const dashboardRoutes = (isLoggedIn) => ({
    path: '/',
    element: isLoggedIn ? <MainLayout /> : <ZPromptLoginExpired />,
    children: [
        // {
        //     path: '/overview',
        //     element: <DashboardOverview />
        // },
    ]
});

const ProductPage = Loadable(lazy(() => import('app/views/master/ProductPage')));
const CategoryPage = Loadable(lazy(() => import('app/views/master/CategoryPage')));
const ClientPage = Loadable(lazy(() => import('app/views/master/ClientPage')));
const CurrencyPage = Loadable(lazy(() => import('app/views/master/CurrencyPage')));
const UomPage = Loadable(lazy(() => import('app/views/master/UomPage')));
const TermsPage = Loadable(lazy(() => import('app/views/master/TermsPage')));
const TermTypePage = Loadable(lazy(() => import('app/views/master/TermTypePage')));
const masterDataRoutes = (isLoggedIn) => ({
    path: '/',
    element: isLoggedIn ? <MainLayout /> : <ZPromptLoginExpired />,
    children: [
        {
            path: '/master/product',
            element: <ProductPage />
        },
        {
            path: '/master/category',
            element: <CategoryPage />
        },
        {
            path: '/master/client',
            element: <ClientPage />
        },
        {
            path: '/master/currency',
            element: <CurrencyPage />
        },
        {
            path: '/master/uom',
            element: <UomPage />
        },
        {
            path: '/master/terms',
            element: <TermsPage />
        },
        {
            path: '/master/termtype',
            element: <TermTypePage />
        },
    ]
});

const ProductInventory = Loadable(lazy(() => import('app/views/inventory/ProductInventory')));
const ProductInventoryView = Loadable(lazy(() => import('app/views/inventory/ProductInventoryView')));
const InventoryTransaction = Loadable(lazy(() => import('app/views/inventory/InventoryTransaction')));
const inventoryRoutes = (isLoggedIn) => ({
    path: '/',
    element: isLoggedIn ? <MainLayout /> : <ZPromptLoginExpired />,
    children: [
        {
            path: '/inv/product',
            element: <ProductInventory />
        },
        {
            path: '/inv/product/view',
            element: <ProductInventoryView />
        },
                {
            path: '/inv/trans',
            element: <InventoryTransaction />
        },
    ]
});

const InvoiceList = Loadable(lazy(() => import('app/views/orders/invoice/InvoiceList')));
const InvoiceCreateUpdate = Loadable(lazy(() => import('app/views/orders/invoice/InvoiceCreateUpdate')));
const InvoiceView = Loadable(lazy(() => import('app/views/orders/invoice/InvoiceView')));
const DoList = Loadable(lazy(() => import('app/views/orders/do/DoList')));
const DoCreateUpdate = Loadable(lazy(() => import('app/views/orders/do/DoCreateUpdate')));
const DoView = Loadable(lazy(() => import('app/views/orders/do/DoView')));
const orderRoutes = (isLoggedIn) => ({
    path: '/',
    element: isLoggedIn ? <MainLayout /> : <ZPromptLoginExpired />,
    children: [
        {
            path: '/invoice',
            element: <InvoiceList />
        },
        {
            path: '/invoice/create',
            element: <InvoiceCreateUpdate />
        },
        {
            path: '/invoice/view',
            element: <InvoiceView />
        },
        {
            path: '/do',
            element: <DoList />
        },
        {
            path: '/do/create',
            element: <DoCreateUpdate />
        },
        {
            path: '/do/view',
            element: <DoView />
        },
    ]
});


// admin
const Settings = Loadable(lazy(() => import('app/views/Settings')));
const adminRoutes = (isLoggedIn) => ({
    path: '/',
    element: isLoggedIn ? <MainLayout /> : <ZPromptLoginExpired />,
    children: [
        {
            path: '/settings',
            element: <Settings />
        },
    ]
});

// system admin
const SysAdminInvoiceDoManagement = Loadable(lazy(() => import('app/views/maintenance/SysAdminInvoiceDoManagement')));
const sysAdminRoutes = (isLoggedIn) => ({
    path: '/',
    element: isLoggedIn ? <MainLayout /> : <ZPromptLoginExpired />,
    children: [
        {
            path: '/maint/sysinvdo',
            element: <SysAdminInvoiceDoManagement />
        },
    ]
});


export const appRoutes = (isLoggedIn) => ([
    adminRoutes(isLoggedIn), dashboardRoutes(isLoggedIn), masterDataRoutes(isLoggedIn), inventoryRoutes(isLoggedIn), orderRoutes(isLoggedIn), sysAdminRoutes(isLoggedIn)
]);