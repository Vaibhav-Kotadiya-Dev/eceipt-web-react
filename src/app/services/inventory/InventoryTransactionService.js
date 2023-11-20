
import axios from 'axios';



import { API_URL } from "config"
import { QUERY } from 'aas/common/constant';
import { GetAuthHeader } from 'aas/common/functions';
import { useQueryClient } from 'react-query';
import useCustomMutation from 'common/hooks/useCustomMutation';
import useCustomQuery from 'common/hooks/useCustomQuery';

const BASE_URL = API_URL.BE_URL

const getTransByCodeHelper = (page, pageSize, sortBy, code) => {
    var params = {
        sortBy: sortBy,
        page: page,
        pageSize: pageSize,
        code: code
    }
    return axios.get(BASE_URL + 'inv/trans/getbycode', { headers: GetAuthHeader(), params: params });
}

const getAllTransHelper = (page, pageSize, sortBy, type, code) => {
    var params = {
        sortBy: sortBy,
        page: page,
        pageSize: pageSize,
        type:type,
        code:code
    }
    return axios.get(BASE_URL + 'inv/trans/getall', { headers: GetAuthHeader(), params: params });
}

const adjustInventoryHelper = (element) => {
    return axios.post(BASE_URL + 'inv/trans/adjust', element, { headers: GetAuthHeader() });
}

export const useAdjustInventory = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(adjustInventoryHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries([QUERY.INVENTORY_TRANS])
            queryClient.invalidateQueries([QUERY.INVENTORY_ITEM])
        }
    })
}

export const useGetInventoryTransByCode = (onSuccess, onError, page, pageSize, sortBy, code) => {
    return useCustomQuery([QUERY.INVENTORY_TRANS, page, pageSize, sortBy, code], () => getTransByCodeHelper(page, pageSize, sortBy, code), {
        onSuccess,
        onError,
        select: (data) => { return data.data },
        keepPreviousData: true,
        enabled: code !== null && code !== undefined
    })
}

export const useGetAllInventoryTrans = (onSuccess, onError, page, pageSize, sortBy, type, code) => {
    return useCustomQuery([QUERY.INVENTORY_TRANS, page, pageSize, sortBy, type, code], () => getAllTransHelper(page, pageSize, sortBy, type, code), {
        onSuccess,
        onError,
        select: (data) => { return data.data },
        keepPreviousData: true,
    })
}