
import axios from 'axios';
import { useQueryClient } from 'react-query';

import useCustomMutation from 'common/hooks/useCustomMutation';
import useCustomQuery from 'common/hooks/useCustomQuery';

import { API_URL } from "config"
import { QUERY } from 'aas/common/constant';
import { GetAuthHeader, GetTenantId } from 'aas/common/functions';


const BASE_URL = API_URL.NOTIFICATION_URL

const getTenantNotificationsHelper = () => {
    return axios.get(BASE_URL + 'notification/getbytenant', { headers: GetAuthHeader() });
}

const deleteTenantNotificationHelper = (id) => {
    var data = {
        id: id,
        tenantId: GetTenantId(),
    }

    return axios.post(BASE_URL + 'notification/deletefromtenant', data, { headers: GetAuthHeader() });
}

export const useTenantNotifications = (onSuccess, onError) => {
    return useCustomQuery([QUERY.TENANT_NOTIFICATION], getTenantNotificationsHelper, {
        onSuccess,
        onError,
        select: (data) => { return data.data },
        refetchInterval: 60000
    })
}

export const useDeleteTenantNotification = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(deleteTenantNotificationHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.TENANT_NOTIFICATION)
        }
    })
}