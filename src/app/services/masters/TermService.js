
import axios from 'axios';

import useCustomQuery from 'common/hooks/useCustomQuery';

import { API_URL } from "config"
import { QUERY } from 'aas/common/constant';
import { GetAuthHeader } from 'aas/common/functions';
import { useQueryClient } from 'react-query';
import useCustomMutation from 'common/hooks/useCustomMutation';
import { DEFAULT_ALL_RECORD_PAGE_SIZE } from 'config';


const BASE_URL = API_URL.BE_URL

const deleteHelper = (id) => {
    var params = { id: id }
    return axios.post(BASE_URL + 'terms/delete', null, { headers: GetAuthHeader(), params: params });
}

const createHelper = (element) => {
    return axios.post(BASE_URL + 'terms/create', element, { headers: GetAuthHeader() });
}

const updateHelper = (element) => {
    return axios.post(BASE_URL + 'terms/update', element, { headers: GetAuthHeader() });
}

const getAllHelper = (page, pageSize, sortBy) => {
    var params = {
        sortBy: sortBy,
        page: page,
        pageSize: pageSize
    }
    return axios.get(BASE_URL + 'terms/getall', { headers: GetAuthHeader(), params: params });
}

export const useAllTerms = (onSuccess, onError, page, pageSize, sortBy) => {
    return useCustomQuery([QUERY.ALL_TERMS, page, pageSize, sortBy], () => getAllHelper(page, pageSize, sortBy), {
        onSuccess,
        onError,
        select: (data) => { return data.data },
        keepPreviousData: true
    })
}

export const useAllTermsNoPaging = (onSuccess, onError, page, pageSize, sortBy) => {
    return useCustomQuery([QUERY.ALL_TERMS_NP, page, pageSize, sortBy], () => getAllHelper(0, DEFAULT_ALL_RECORD_PAGE_SIZE, "name,asc"), {
        onSuccess,
        onError,
        select: (data) => { return data.data },
        keepPreviousData: true
    })
}

export const useDeleteTerms = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(deleteHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.ALL_TERMS)
        }
    })
}

export const useCreateTerms = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(createHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.ALL_TERMS)
        }
    })
}

export const useUpdateTerms = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(updateHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.ALL_TERMS)
        }
    })
}