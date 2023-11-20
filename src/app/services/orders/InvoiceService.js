
import axios from 'axios';

// import useCustomQuery from 'common/hooks/useCustomQuery';

import { API_URL } from "config"
import { QUERY } from 'aas/common/constant';
import { GetAuthHeader } from 'aas/common/functions';
import { useQueryClient } from 'react-query';
import useCustomMutation from 'common/hooks/useCustomMutation';
import useCustomQuery from 'common/hooks/useCustomQuery';

const BASE_URL = API_URL.BE_URL


const getInvoiceHelper = (id) => {
    var params = { id: id }
    return axios.get(BASE_URL + 'invoice/get', { headers: GetAuthHeader(), params: params });
}

const getInvoiceByNumberHelper = (orderNumber) => {
    var params = { orderNumber: orderNumber }
    return axios.get(BASE_URL + 'invoice/getbynumber', { headers: GetAuthHeader(), params: params });
}

const getInvoiceNumberListHelper = () => {
    var params = {
        sortBy: 'createdDate,desc',
        page: 0,
        pageSize: 1000
    }
    return axios.get(BASE_URL + 'invoice/getorderlist', { headers: GetAuthHeader(), params: params });
}

const saveHelper = (element) => {
    return axios.post(BASE_URL + 'invoice/save', element, { headers: GetAuthHeader() });
}

const finalizeHelper = (id) => {
    var params = { id: id }
    return axios.post(BASE_URL + 'invoice/finalize', null, { headers: GetAuthHeader(), params: params });
}

const reviseHelper = (id) => {
    var params = { id: id }
    return axios.post(BASE_URL + 'invoice/revise', null, { headers: GetAuthHeader(), params: params });
}

const invoiceHelper = (id) => {
    var params = { id: id }
    return axios.post(BASE_URL + 'invoice/invoice', null, { headers: GetAuthHeader(), params: params });
}

const paidHelper = (id) => {
    var params = { id: id }
    return axios.post(BASE_URL + 'invoice/paid', null, { headers: GetAuthHeader(), params: params });
}

const cancelHelper = ({ id, status }) => {
    var params = { id: id, status: status }
    return axios.post(BASE_URL + 'invoice/cancel', null, { headers: GetAuthHeader(), params: params });
}

const getAllHelper = (page, pageSize, sortBy, status, orderNumber) => {
    var params = {
        sortBy: sortBy,
        page: page,
        pageSize: pageSize,
        status: status,
        orderNumber: orderNumber
    }
    return axios.get(BASE_URL + 'invoice/getall', { headers: GetAuthHeader(), params: params });
}

const regeneratePDF = ({ id }) => {
    var params = {}
    return axios.post(BASE_URL + 'invoice/retrygeneratepdf?id=' + id, null, { headers: GetAuthHeader(), params: params });
}

const getPDF = ({ id }) => {
    return axios.get(BASE_URL + 'invoice/getpdf?id=' + id, { headers: GetAuthHeader() });
}

const previewPDF = ({ id }) => {
    return axios.get(BASE_URL + 'invoice/previewpdf?id=' + id, { headers: GetAuthHeader() });
}

const resendEmail = ({ id, receiverAddress }) => {
    var params = {
        id: id,
        receiverAddress: receiverAddress,
    }
    return axios.post(BASE_URL + 'invoice/resend', params, { headers: GetAuthHeader(), params: {} });
}

export const useAllInvoice = (onSuccess, onError, page, pageSize, sortBy, status, orderNumber) => {
    return useCustomQuery([QUERY.ALL_INVOICE, page, pageSize, sortBy, status, orderNumber], () => getAllHelper(page, pageSize, sortBy, status, orderNumber), {
        onSuccess,
        onError,
        select: (data) => { return data.data },
        keepPreviousData: true
    })
}

export const useGetInvoiceNumberList = (onSuccess, onError) => {
    return useCustomQuery([QUERY.OPEN_INVOICE_NUMBER], () => getInvoiceNumberListHelper(), {
        onSuccess,
        onError,
        select: (data) => { return data.data }
    })
}

export const useQueryInvoiceByOrderNumber = (onSuccess, onError, orderNumber) => {
    return useCustomQuery([QUERY.INVOICE, orderNumber], () => getInvoiceByNumberHelper(orderNumber), {
        onSuccess,
        onError,
        select: (data) => { return data.data },
        enabled: orderNumber !== null
    })
}

// export const useGetInvoice = (onSuccess, onError, id) => {
//     return useCustomQuery([QUERY.INVOICE, id], () => getInvoiceHelper(id), {
//         onSuccess,
//         onError,
//         select: (data) => { return data.data },
//         enabled: id > 0
//     })
// }

export const useGetInvoiceById = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(getInvoiceHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.INVOICE)
        }
    })
}

export const useGetInvoiceByOrderNumber = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(getInvoiceByNumberHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.INVOICE)
        }
    })
}

export const useSaveInvoice = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(saveHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.INVOICE)
        }
    })
}

export const useFinalizeInvoice = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(finalizeHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.ALL_INVOICE)
        }
    })
}

export const useReviseInvoice = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(reviseHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.ALL_INVOICE)
        }
    })
}

export const useInvoiceInvoice = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(invoiceHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.ALL_INVOICE)
        }
    })
}

export const usePaidInvoice = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(paidHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.ALL_INVOICE)
        }
    })
}

export const useCancelInvoice = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(cancelHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.ALL_INVOICE)
        }
    })
}

export const useRegeneratePDF = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(regeneratePDF, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.ALL_INVOICE)
        }
    })
}

export const useGetPDF = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(getPDF, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.ALL_INVOICE)
        }
    })
}

export const usePreviewPDF = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(previewPDF, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.ALL_INVOICE)
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

