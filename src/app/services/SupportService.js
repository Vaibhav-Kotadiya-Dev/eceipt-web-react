
import axios from 'axios';

import { API_URL } from "config"
import { GetAuthHeader } from 'aas/common/functions';
import useCustomMutation from 'common/hooks/useCustomMutation';


const BASE_URL = API_URL.BE_URL

const sendSupportEmailHelper = (element) => {
    return axios.post(BASE_URL + 'support/send', element, { headers: GetAuthHeader() });
}

export const useSendSupportEmail = (onSuccess, onError) => {
    return useCustomMutation(sendSupportEmailHelper, {
        onSuccess,
        onError,
    })
}
