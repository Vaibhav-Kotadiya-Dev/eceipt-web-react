import axios from 'axios';

import { API_URL } from "config"
import { GetAuthHeader } from 'aas/common/functions';
import useCustomMutation from 'common/hooks/useCustomMutation';


const BASE_URL = API_URL.BE_URL


const regenerateInvoiceHelper = ({ tenantId, orderNumber }) => {
    var params = {
        tenantId: tenantId,
        orderNumber: orderNumber
    }
    return axios.post(BASE_URL + 'sys/retryinvoicepdf', null, { headers: GetAuthHeader(), params: params });
}

const regenerateDoHelper = ({ tenantId, orderNumber }) => {
    var params = {
        tenantId: tenantId,
        orderNumber: orderNumber
    }
    return axios.post(BASE_URL + 'sys/retrydopdf', null, { headers: GetAuthHeader(), params: params });
}

export const useRegenerateInvoice = (onSuccess, onError) => {
    return useCustomMutation(regenerateInvoiceHelper, {
        onSuccess,
        onError,
        onSettled: () => { }
    })
}

export const useRegenerateDo = (onSuccess, onError) => {
    return useCustomMutation(regenerateDoHelper, {
        onSuccess,
        onError,
        onSettled: () => { }
    })
}