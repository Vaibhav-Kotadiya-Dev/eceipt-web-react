
import axios from 'axios';

// import useCustomQuery from 'common/hooks/useCustomQuery';

import { API_URL } from "config"
import { QUERY } from 'aas/common/constant';
import { GetAuthHeader } from 'aas/common/functions';
import useCustomQuery from 'common/hooks/useCustomQuery';


const BASE_URL = API_URL.BE_URL


const getOutstandingInvoiceHelper = (id) => {
    return axios.get(BASE_URL + 'dashboard/invooutstanding', { headers: GetAuthHeader() });
}
const getOverdueInvoiceHelper = (id) => {
    return axios.get(BASE_URL + 'dashboard/invooverdue', { headers: GetAuthHeader() });
}

const getInvoiceHistorySummaryHelper = (id) => {
    return axios.get(BASE_URL + 'dashboard/invohistory', { headers: GetAuthHeader() });
}

const getOutstandingDoHelper = (id) => {
    return axios.get(BASE_URL + 'dashboard/dooutstanding', { headers: GetAuthHeader() });
}
const getOverdueDoHelper = (id) => {
    return axios.get(BASE_URL + 'dashboard/dooverdue', { headers: GetAuthHeader() });
}

const getDoHistorySummaryHelper = (id) => {
    return axios.get(BASE_URL + 'dashboard/dohistory', { headers: GetAuthHeader() });
}

const getInventoryStatusHelper = (id) => {
    return axios.get(BASE_URL + 'dashboard/invstatus', { headers: GetAuthHeader() });
}

const getLowInventoryListHelper = (id) => {
    return axios.get(BASE_URL + 'dashboard/lowinvlist', { headers: GetAuthHeader() });
}

export const useGetOutstandingInvoice = (onSuccess, onError) => {
    return useCustomQuery([QUERY.DASHBOARD_OUTSTANDING_INVOICE], getOutstandingInvoiceHelper, {
        onSuccess,
        onError,
        select: (data) => { return data.data }
    })
}
export const useGetOverdueInvoice = (onSuccess, onError) => {
    return useCustomQuery([QUERY.DASHBOARD_OVERDUE_INVOICE], getOverdueInvoiceHelper, {
        onSuccess,
        onError,
        select: (data) => { return data.data }
    })
}
export const useGetInvoiceHistory = (onSuccess, onError) => {
    return useCustomQuery([QUERY.DASHBOARD_INVOICE_HISTORY], getInvoiceHistorySummaryHelper, {
        onSuccess,
        onError,
        select: (data) => { return data.data }
    })
}

export const useGetOutstandingDo = (onSuccess, onError) => {
    return useCustomQuery([QUERY.DASHBOARD_OUTSTANDING_DO], getOutstandingDoHelper, {
        onSuccess,
        onError,
        select: (data) => { return data.data }
    })
}
export const useGetOverdueDo = (onSuccess, onError) => {
    return useCustomQuery([QUERY.DASHBOARD_OVERDUE_DO], getOverdueDoHelper, {
        onSuccess,
        onError,
        select: (data) => { return data.data }
    })
}

export const useGetDoHistory = (onSuccess, onError) => {
    return useCustomQuery([QUERY.DASHBOARD_DO_HISTORY], getDoHistorySummaryHelper, {
        onSuccess,
        onError,
        select: (data) => { return data.data }
    })
}

export const useGetInventoryStatus = (onSuccess, onError) => {
    return useCustomQuery([QUERY.DASHBOARD_INV_STATUS], getInventoryStatusHelper, {
        onSuccess,
        onError,
        select: (data) => { return data.data }
    })
}

export const useGetLowInventoryList = (onSuccess, onError) => {
    return useCustomQuery([QUERY.DASHBOARD_LOW_INV_LIST], getLowInventoryListHelper, {
        onSuccess,
        onError,
        select: (data) => { return data.data }
    })
}
