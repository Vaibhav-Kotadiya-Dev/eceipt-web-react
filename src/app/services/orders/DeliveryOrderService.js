
import axios from 'axios';

// import useCustomQuery from 'common/hooks/useCustomQuery';

import { API_URL } from "config"
import { QUERY } from 'aas/common/constant';
import { GetAuthHeader } from 'aas/common/functions';
import { useQueryClient } from 'react-query';
import useCustomMutation from 'common/hooks/useCustomMutation';
import useCustomQuery from 'common/hooks/useCustomQuery';

const BASE_URL = API_URL.BE_URL


const getHelper = (id) => {
    var params = { id: id }
    return axios.get(BASE_URL + 'do/get', { headers: GetAuthHeader(), params: params });
}

const getDoByInvoiceNumberHelper = (invoiceNumber) => {
    var params = { invoiceNumber: invoiceNumber }
    return axios.get(BASE_URL + 'do/getbyinvoicenr', { headers: GetAuthHeader(), params: params });
}

const saveHelper = (element) => {
    return axios.post(BASE_URL + 'do/save', element, { headers: GetAuthHeader() });
}

const finalizeHelper = (id) => {
    var params = { id: id }
    return axios.post(BASE_URL + 'do/finalize', null, { headers: GetAuthHeader(), params: params });
}

const reviseHelper = (id) => {
    var params = { id: id }
    return axios.post(BASE_URL + 'do/revise', null, { headers: GetAuthHeader(), params: params });
}

const shipHelper = (id) => {
    var params = { id: id }
    return axios.post(BASE_URL + 'do/ship', null, { headers: GetAuthHeader(), params: params });
}

const receiveHelper = (id) => {
    var params = { id: id }
    return axios.post(BASE_URL + 'do/received', null, { headers: GetAuthHeader(), params: params });
}

const cancelHelper = ({ id, status }) => {
    var params = { id: id, status: status }
    return axios.post(BASE_URL + 'do/cancel', null, { headers: GetAuthHeader(), params: params });
}

const getAllHelper = (page, pageSize, sortBy, status, orderNumber) => {
    var params = {
        sortBy: sortBy,
        page: page,
        pageSize: pageSize,
        status: status,
        orderNumber: orderNumber
    }
    return axios.get(BASE_URL + 'do/getall', { headers: GetAuthHeader(), params: params });
}

const regeneratePDF = ({ id }) => {
    var params = {}
    return axios.post(BASE_URL + 'do/retrygeneratepdf?id=' + id, null, { headers: GetAuthHeader(), params: params });
}

const getPDF = ({ id }) => {
    return axios.get(BASE_URL + 'do/getpdf?id=' + id, { headers: GetAuthHeader() });
}

const previewPDF = ({ id }) => {
    return axios.get(BASE_URL + 'do/previewpdf?id=' + id, { headers: GetAuthHeader() });
}


const resendEmail = ({ id, receiverAddress }) => {
    var params = {
        id: id,
        receiverAddress: receiverAddress,
    }
    return axios.post(BASE_URL + 'do/resend', params, { headers: GetAuthHeader(), params: {} });
}

export const useAll = (onSuccess, onError, page, pageSize, sortBy, status, orderNumber) => {
    return useCustomQuery([QUERY.ALL_DELIVERY_ORDER, page, pageSize, sortBy, status, orderNumber], () => getAllHelper(page, pageSize, sortBy, status, orderNumber), {
        onSuccess,
        onError,
        select: (data) => { return data.data },
        keepPreviousData: true
    })
}

export const useGetById = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(getHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.DELIVERY_ORDER)
        }
    })
}

export const useGetDoByInvoiceNumber = (onSuccess, onError, invoiceNumber) => {
    return useCustomQuery([QUERY.CHECK_LINKED_DELIVERY_ORDER, invoiceNumber], () => getDoByInvoiceNumberHelper(invoiceNumber), {
        onSuccess,
        onError,
        select: (data) => { return data.data },
        enabled: invoiceNumber !== null
    })
}

export const useSave = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(saveHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.DELIVERY_ORDER)
        }
    })
}

export const useFinalize = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(finalizeHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.ALL_DELIVERY_ORDER)
        }
    })
}

export const useRevise = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(reviseHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.ALL_DELIVERY_ORDER)
        }
    })
}

export const useShip = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(shipHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.ALL_DELIVERY_ORDER)
        }
    })
}

export const useReceive = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(receiveHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.ALL_DELIVERY_ORDER)
        }
    })
}

export const useCancel = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(cancelHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.ALL_DELIVERY_ORDER)
        }
    })
}

export const useRegeneratePDF = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(regeneratePDF, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.ALL_DELIVERY_ORDER)
        }
    })
}

export const useGetPDF = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(getPDF, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.ALL_DELIVERY_ORDER)
        }
    })
}

export const usePreviewPDF = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(previewPDF, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.ALL_DELIVERY_ORDER)
        }
    })
}

export const useResendEmail = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(resendEmail, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.ALL_INVOICE)
        }
    })
}

