import axios from 'axios';
import { QUERY, } from 'aas/common/constant';
import { API_URL } from "config"
import { GetAuthHeader } from 'aas/common/functions';
import useCustomQuery from 'common/hooks/useCustomQuery';
import useCustomMutation from 'common/hooks/useCustomMutation';
import { useQueryClient } from 'react-query';

const BASE_URL = API_URL.AAS_URL;


const getTenatPaymentStatusHelper = () => {
    return axios.get(BASE_URL + 'finance/subscription/get', { headers: GetAuthHeader() });
}

const getTenatPaymentTransactionHelper = () => {
    return axios.get(BASE_URL + 'finance/subscription/gettransaction', { headers: GetAuthHeader() });
}


const getPricePlanHelper = () => {
    return axios.get(BASE_URL + 'finance/subscription/getprice', { headers: GetAuthHeader() });
}

const getGetPaymentLinkHelper = (data) => {
    return axios.post(BASE_URL + 'finance/subscription/pay', data, { headers: GetAuthHeader() });
}

const cancelSubscriptionHelper = () => {
    return axios.post(BASE_URL + 'finance/subscription/cancel', null, { headers: GetAuthHeader() });
}

export const useGetTenatPaymentTrans = (onSuccess, onError) => {
    return useCustomQuery([QUERY.PAYMENT_TRANSACTION], getTenatPaymentTransactionHelper, {
        onSuccess,
        onError,
        select: (data) => { return data.data }
    })
}

export const useGetTenatPaymentStatus = (onSuccess, onError) => {
    return useCustomQuery([QUERY.PAYMENT_STATUS], getTenatPaymentStatusHelper, {
        onSuccess,
        onError,
        select: (data) => { return data.data },
        staleTime: 5 * (60 * 1000), //5min
        cacheTime: 10 * (60 * 1000),
    })
}

export const useGetPricePlan = (onSuccess, onError) => {
    return useCustomQuery([QUERY.PRICE_LIST], getPricePlanHelper, {
        onSuccess,
        onError,
        select: (data) => { return data.data },
    })
}

export const useGetPaymentLink = (onSuccess, onError) => {
    return useCustomMutation(getGetPaymentLinkHelper, {
        onSuccess,
        onError,
        onSettled: () => { }
    })
}

export const useCancelSubscription = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(cancelSubscriptionHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.PAYMENT_STATUS)
          }
    })
}