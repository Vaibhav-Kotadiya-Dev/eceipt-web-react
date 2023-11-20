import { useQueryClient } from 'react-query'
import axios from 'axios';
import { GetAuthHeader } from 'aas/common/functions';
import { API_URL } from "config"
import { QUERY } from 'aas/common/constant';
import useCustomQuery from 'common/hooks/useCustomQuery';
import useCustomMutation from 'common/hooks/useCustomMutation';

const BASE_URL = API_URL.AAS_URL;

/*

Use by system admin only

*/

const getAllUsersHelper = () => {
  return axios.get(BASE_URL + 'aas/sys/getusers', { headers: GetAuthHeader() });
}

const updateUserinfoHelper = (data) => {
  return axios.post(BASE_URL + 'aas/sys/updateuserinfo', data, { headers: GetAuthHeader() });
}

const getAllTenantsHelper = () => {
  return axios.get(BASE_URL + 'aas/sys/gettenants', { headers: GetAuthHeader() });
}

const getAllTenantsSubscriptionHelper = () => {
  return axios.get(BASE_URL + 'aas/sys/gettenantsub', { headers: GetAuthHeader(), params: { id: 0 } });
}

const updateTenantInfoHelper = (data) => {
  return axios.post(BASE_URL + 'aas/sys/updatetenantinfo', data, { headers: GetAuthHeader() });
}

const changeTenantPackageHelper = ({ tenantId, packageCode, expireDate }) => {
  return axios.post(BASE_URL + 'aas/sys/changetenantpackage', null, { headers: GetAuthHeader(), params: { tenantId: tenantId, packageCode: packageCode, expireDate: expireDate } });
}


export const useAllUsersData = (onSuccess, onError) => {
  // const queryClient = useQueryClient()
  return useCustomQuery([QUERY.ALL_USER], getAllUsersHelper, {
    onSuccess,
    onError,
    select: (data) => { return data.data }
  })
}

export const useUpdateUserinfo = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(updateUserinfoHelper, {
    onSuccess,
    onError,
    onSettled: () => {
      queryClient.invalidateQueries(QUERY.ALL_USER)
    }
  })
}

export const useAllTenantData = (onSuccess, onError) => {
  // const queryClient = useQueryClient()
  return useCustomQuery([QUERY.ALL_TENANT], getAllTenantsHelper, {
    onSuccess,
    onError,
    select: (data) => { return data.data }
  })
}

export const useUpdateTenantInfo = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(updateTenantInfoHelper, {
    onSuccess,
    onError,
    onSettled: () => {
      queryClient.invalidateQueries(QUERY.ALL_TENANT)
    }
  })
}

export const useGetAllTenantsSubscription = (onSuccess, onError) => {
  // const queryClient = useQueryClient()
  return useCustomQuery([], getAllTenantsSubscriptionHelper, {
    onSuccess,
    onError,
    select: (data) => { return data.data }
  })
}


export const useChangeTenantPackage = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(changeTenantPackageHelper, {
    onSuccess,
    onError,
    onSettled: () => {
      queryClient.invalidateQueries(QUERY.ALL_TENANT)
    }
  })
}
