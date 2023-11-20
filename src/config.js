import axios from 'axios';

axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.common["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept, method, path";
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json, text/plain, */*';
axios.defaults.timeout = 10000;

// axios.interceptors.request.use(request => {
//   console.log('Starting Request', JSON.stringify(request, null, 2))
//   return request
// })

const config = {
    basename: '',
    defaultPath: '/home',
    fontFamily: `'Roboto', sans-serif`,
    borderRadius: 12
};

export default config;

export const API_URL = {
    SCHEDULER_BASE_URL: window.SCHEDULER_BASE_URL !== '#SCHEDULER_BASE_URL' ? window.SCHEDULER_BASE_URL : process.env.REACT_APP_SCHEDULER_BASE_URL,
    NOTIFICATION_URL: window.NOTIFICATION_URL !== '#NOTIFICATION_URL' ? window.NOTIFICATION_URL : process.env.REACT_APP_NOTIFICATION_URL,
    AAS_URL: window.AAS_URL !== '#AAS_URL' ? window.AAS_URL : process.env.REACT_APP_AAS_URL,
    BE_URL: window.BE_URL !== '#BE_URL' ? window.BE_URL : process.env.REACT_APP_BE_URL,


    // BE_URL: "http://localhost:8080/api/",
    // SCHEDULER_BASE_URL: "http://192.168.1.205/api/",
    // SCHEDULER_BASE_URL: "http://localhost:8080/api/",

    // NOTIFICATION_URL: "http://localhost:8080/api/",


    // AAS_URL: "http://192.168.1.206/api/",
    // AAS_URL: "http://localhost:8080/api/",
    // AAS_URL: "http://192.168.1.81:8000/api/",
    // https://svc.expressoom.com/aas/api/
}


// max page size for all data when retrive from be
export const DEFAULT_ALL_RECORD_PAGE_SIZE = 1000;