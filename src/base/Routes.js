import { Navigate, useRoutes } from 'react-router-dom';
import { lazy, useEffect, useState } from 'react';

import config from 'config';

// project imports
import MainLayout from 'base/layout/MainLayout';
import Loadable from 'ui-component/common/Loadable';
import { LsTokenExpire, LsUserRememberMe, LsUserTenant, LsUserToken } from 'aas/common/constant';
import ZPromptLoginExpired from 'ui-component/ZPromptLoginExpired';
import { aasRoutes } from 'aas/base/AasRoutes';
import { appRoutes } from 'app/base/AppRoutes';
import { RefreshTokenIfNeed } from "aas/common/functions";

//define where it goes to when no url keyed in
const index = () => ({
    path: '/',
    children: [
        {
            path: '/',
            skipLazyLoad: true,
            element: <Navigate to="../login" />,
        },
    ]
});

const Home = Loadable(lazy(() => import('views/Home')));
const NoPermissionPage = Loadable(lazy(() => import('views/NoPermissionPage')));
const LoginInvalidPage = Loadable(lazy(() => import('views/LoginInvalidPage')));
const routes = (isLoggedIn) => ({
    path: '/',
    element: isLoggedIn ? <MainLayout /> : <ZPromptLoginExpired />,
    children: [
        {
            path: '/home',
            element: <Home />
        },
        {
            path: '/401',
            element: <LoginInvalidPage />
        },
        {
            path: '/403',
            element: <NoPermissionPage />
        },
    ]
});


const NotFoundPage = Loadable(lazy(() => import('views/NotFoundPage')));
const exceptionRoutes = () => ({
    path: '*',
    element: <NotFoundPage />
});


// ==============================|| ROUTING RENDER ||============================== //
export default function MainRoutes() {
    var isLoggedIn = true;

    // 使用useState可等待请求完成后做后续处理
    const [, setRefresh] = useState(false);
    useEffect(() => {
        RefreshTokenIfNeed().then((e) => {
            if (e) {
                setRefresh(true)
            }
        })
    }, []);

    var token = localStorage.getItem(LsUserToken);
    var tenantId = localStorage.getItem(LsUserTenant)
    var expirationTime = localStorage.getItem(LsTokenExpire);
    var rememberMe = Boolean(localStorage.getItem(LsUserRememberMe));

    if (!token || token === 'undefined' || !expirationTime || expirationTime === 'undefined' || !tenantId || tenantId === 'undefined' || (expirationTime < new Date().getTime())) {
        isLoggedIn = false;
    }

    // return useRoutes([index(true), routes(isLoggedIn),...aasRoutes(isLoggedIn)], config.basename);
    return useRoutes([index(), exceptionRoutes(), routes(isLoggedIn), ...aasRoutes(isLoggedIn, rememberMe), ...appRoutes(isLoggedIn)], config.basename);
}


