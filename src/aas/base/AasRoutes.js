import { lazy } from 'react';

// project imports
import MainLayout from 'base/layout/MainLayout';
import MinimalLayout from 'base/layout/MinimalLayout';
import Loadable from 'ui-component/common/Loadable';
import ZPromptLoginExpired from 'ui-component/ZPromptLoginExpired';
import {Navigate} from "react-router-dom";
// import {LsUserRememberMe} from "../common/constant";

//setup
const TenantCreate = Loadable(lazy(() => import('aas/views/TenantCreate')));

//auth
const Login = Loadable(lazy(() => import('aas/views/auth/Login')));
const Registration = Loadable(lazy(() => import('aas/views/auth/Registration')));
const VerifyEmail = Loadable(lazy(() => import('aas/views/auth/VerifyEmail')));
const ForgotPassword = Loadable(lazy(() => import('aas/views/auth/ForgotPassword')));
const ResetPassword = Loadable(lazy(() => import('aas/views/auth/ResetPassword')));
const AcceptInvitation = Loadable(lazy(() => import('aas/views/auth/AcceptInvitation')));


const authPublicRoutes = (isLoggedIn) => ({
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '/login',
            element: isLoggedIn?<Navigate to="../home" />:<Login />
        },
        {
            path: '/register',
            element: <Registration />
        },
        {
            path: '/verify',
            element: <VerifyEmail />
        },
        {
            path: '/forgotpassword',
            element: <ForgotPassword />
        },
        {
            path: '/pwdreset',
            element: <ResetPassword />
        },
        {
            path: '/acceptinvitation',
            element: <AcceptInvitation />
        },
    ]
});


const initialSetupRoutes = (isLoggedIn) => ({
    path: '/',
    element: isLoggedIn ? <MainLayout /> : <ZPromptLoginExpired />,
    children: [
        {
            path: '/tenant/create',
            element: <TenantCreate />
        },
    ]
});


//scheduler
const SchedulerList = Loadable(lazy(() => import('aas/views/sysadmin/scheduler/SchedulerList')));
const SchedulerLog = Loadable(lazy(() => import('aas/views/sysadmin/scheduler/SchedulerLog')));

const schedulerRoutes = (isLoggedIn) => ({
    path: '/',
    element: isLoggedIn ? <MainLayout /> : <ZPromptLoginExpired />,
    children: [
        {
            path: '/sys/scheduler',
            element: <SchedulerList />
        },
        {
            path: '/sys/scheduler/log',
            element: <SchedulerLog />
        }
    ]
});


//api-configuration
const SubscriptionPackage = Loadable(lazy(() => import('aas/views/sysadmin/api-configuration/SubscriptionPackage')));
const ServiceGroup = Loadable(lazy(() => import('aas/views/sysadmin/api-configuration/ServiceGroup')));
const Services = Loadable(lazy(() => import('aas/views/sysadmin/api-configuration/Services')));

const apiConfigurationRoutes = (isLoggedIn) => ({
    path: '/',
    element: isLoggedIn ? <MainLayout /> : <ZPromptLoginExpired />,
    children: [
        {
            path: '/sys/config/packages',
            element: <SubscriptionPackage />
        },
        {
            path: '/sys/config/servicegroup',
            element: <ServiceGroup />
        },
        {
            path: '/sys/config/services',
            element: <Services />
        },
    ]
});


//tenant-management
const Tenants = Loadable(lazy(() => import('aas/views/sysadmin/tenant-management/Tenants')));
const Users = Loadable(lazy(() => import('aas/views/sysadmin/tenant-management/Users')));

const tenantManagementRoutes = (isLoggedIn) => ({
    path: '/',
    element: isLoggedIn ? <MainLayout /> : <ZPromptLoginExpired />,
    children: [
        {
            path: '/sys/tenant-management/tenants',
            element: <Tenants />
        },
        {
            path: '/sys/tenant-management/users',
            element: <Users />
        }
    ]
});

//tenant admin management
const CompanyProfile = Loadable(lazy(() => import('aas/views/tenantadmin/CompanyProfile')));
const UserManagement = Loadable(lazy(() => import('aas/views/tenantadmin/UserManagement')));
const TenantSubscription = Loadable(lazy(() => import('aas/views/tenantadmin/TenantSubscription')));
const tenantAdminSettingsRoutes = (isLoggedIn) => ({
    path: '/',
    element: isLoggedIn ? <MainLayout /> : <ZPromptLoginExpired />,
    children: [
        {
            path: '/admin/company/profile',
            element: <CompanyProfile />
        },
        {
            path: '/admin/company/users',
            element: <UserManagement />
        },
        {
            path: '/admin/company/subscription',
            element: <TenantSubscription />
        },
    ]
});

//users
const UserProfile = Loadable(lazy(() => import('aas/views/user/UserProfile')));
const usersRoutes = (isLoggedIn) => ({
    path: '/',
    element: isLoggedIn ? <MainLayout /> : <ZPromptLoginExpired />,
    children: [
        {
            path: '/users/profile',
            element: <UserProfile />
        },
    ]
});

export const aasRoutes = (isLoggedIn,rememberMe) => ([
    authPublicRoutes(isLoggedIn && rememberMe), initialSetupRoutes(isLoggedIn),
    schedulerRoutes(isLoggedIn),
    apiConfigurationRoutes(isLoggedIn),
    tenantManagementRoutes(isLoggedIn),
    tenantAdminSettingsRoutes(isLoggedIn),
    usersRoutes(isLoggedIn)
]);