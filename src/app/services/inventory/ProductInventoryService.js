
import axios from 'axios';

import useCustomQuery from 'common/hooks/useCustomQuery';

import { API_URL } from "config"
import { QUERY } from 'aas/common/constant';
import { GetAuthHeader } from 'aas/common/functions';
// import { useQueryClient } from 'react-query';
// import useCustomMutation from 'common/hooks/useCustomMutation';


const BASE_URL = API_URL.BE_URL

const getByCodeHelper = (code) => {
    var params = { code: code }
    return axios.get(BASE_URL + 'inv/item/get', { headers: GetAuthHeader(), params: params });
}

const getByCodesHelper = (codes) => {
    var params = { codes: codes.toString() }
    return axios.get(BASE_URL + 'inv/item/getbycodes', { headers: GetAuthHeader(), params: params });
}


export const useGetProductInvByCode = (onSuccess, onError, code) => {
    return useCustomQuery([QUERY.INVENTORY_ITEM, code], () => getByCodeHelper(code), {
        onSuccess,
        onError,
        select: (data) => { return data.data },
        enabled: code !== null && code !== undefined
    })
}

export const useGetProductInvByCodes = (onSuccess, onError, codes) => {
    return useCustomQuery([QUERY.INVENTORY_ITEMS, codes], () => getByCodesHelper(codes), {
        onSuccess,
        onError,
        select: (data) => { return data.data },
        enabled: codes !== null && codes !== undefined
    })
}