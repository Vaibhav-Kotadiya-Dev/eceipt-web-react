import { useSelector } from 'react-redux';
import { QueryClientProvider, QueryClient } from 'react-query'

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// defaultTheme
import themes from './themes';

// base route and layout
import MainRoutes from 'base/Routes';
import NavigationScroll from 'base/NavigationScroll';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./i18n/i18n";
// import { API_URL } from 'config';
// ==============================|| APP ||============================== //

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            retryDelay: 3000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            cacheTime: 5000,
        },
        mutations: {

        },
    },
})

// console.log(API_URL.SCHEDULER_BASE_URL)
// console.log(API_URL.NOTIFICATION_URL)
// console.log(API_URL.AAS_URL)

const App = () => {
    const customization = useSelector((state) => state.theme); //to change theme

    return (<>
        <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
        />
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <QueryClientProvider client={queryClient}>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={themes(customization)}>
                        <CssBaseline />
                        <NavigationScroll>
                            <MainRoutes />
                        </NavigationScroll>
                    </ThemeProvider>
                </StyledEngineProvider>
            </QueryClientProvider>
        </GoogleOAuthProvider>
    </>

    );
};

export default App;

