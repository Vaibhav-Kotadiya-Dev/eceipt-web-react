
import axios from 'axios';

import useCustomQuery from 'common/hooks/useCustomQuery';

import { API_URL } from "config"
import { QUERY } from 'aas/common/constant';
import { GetAuthHeader } from 'aas/common/functions';
import { useQueryClient } from 'react-query';
import useCustomMutation from 'common/hooks/useCustomMutation';


const BASE_URL = API_URL.BE_URL

const createHelper = (element) => {
    return axios.post(BASE_URL + 'settings/save', element, { headers: GetAuthHeader() });
}

const getAllHelper = () => {
    return axios.get(BASE_URL + 'settings/get', { headers: GetAuthHeader() });
}

export const useSetting = (onSuccess, onError) => {
    return useCustomQuery([QUERY.ALL_SETTINGS], getAllHelper, {
        onSuccess,
        onError,
        select: (data) => { return data.data },
    })
}


export const useSaveSetting = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(createHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.ALL_SETTINGS)
        }
    })
}
