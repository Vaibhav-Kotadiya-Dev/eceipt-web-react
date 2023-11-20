
import axios from 'axios';

import useCustomQuery from 'common/hooks/useCustomQuery';

import { API_URL } from "config"
import { QUERY } from 'aas/common/constant';
import { GetAuthHeader } from 'aas/common/functions';
import { useQueryClient } from 'react-query';
import useCustomMutation from 'common/hooks/useCustomMutation';


const BASE_URL = API_URL.BE_URL

const deleteHelper = (id) => {
    var params = { id: id }
    return axios.post(BASE_URL + 'product/delete', null, { headers: GetAuthHeader(), params: params });
}

const createHelper = (element) => {
    return axios.post(BASE_URL + 'product/create', element, { headers: GetAuthHeader() });
}

const updateHelper = (element) => {
    return axios.post(BASE_URL + 'product/update', element, { headers: GetAuthHeader() });
}

const getByIdHelper = (id) => {
    var params = { id: id }
    return axios.get(BASE_URL + 'product/get', { headers: GetAuthHeader(), params: params });
}

const getAllHelper = (page, pageSize, sortBy) => {
    var params = {
        sortBy: sortBy,
        page: page,
        pageSize: pageSize
    }
    return axios.get(BASE_URL + 'product/getall', { headers: GetAuthHeader(), params: params });
}

export const useAllProduct = (onSuccess, onError, page, pageSize, sortBy) => {
    return useCustomQuery([QUERY.ALL_PRODUCT, page, pageSize, sortBy], () => getAllHelper(page, pageSize, sortBy), {
        onSuccess,
        onError,
        select: (data) => { return data.data },
        keepPreviousData: true
    })
}

export const useFindProductById = (onSuccess, onError, id) => {
    return useCustomQuery([QUERY.SINGLE_PRODUCT, id], () => getByIdHelper(id), {
        onSuccess,
        onError,
        select: (data) => { return data.data },
        enabled: id !== null
    })
}

export const useDeleteProduct = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(deleteHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.ALL_PRODUCT)
        }
    })
}

export const useCreateProduct = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(createHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.ALL_PRODUCT)
        }
    })
}

export const useUpdateProduct = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(updateHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.ALL_PRODUCT)
        }
    })
}