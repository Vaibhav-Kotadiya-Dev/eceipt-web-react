import axios from 'axios';
import { QUERY } from 'aas/common/constant';
import { GetAuthHeader } from 'aas/common/functions';
import useCustomMutation from 'common/hooks/useCustomMutation';
import useCustomQuery from 'common/hooks/useCustomQuery';
import { API_URL } from "config"
import { useQueryClient } from 'react-query';

const BASE_URL = API_URL.AAS_URL;

/*

Use by tenant admin, some api used by user

*/

const createTenantHelper = (tenantInfo) => {
  return axios.post(BASE_URL + 'aas/tenant/createtenant', tenantInfo, { headers: GetAuthHeader() });
}

const getTenantInfoHelper = () => {
  return axios.get(BASE_URL + 'aas/tenant/gettenantinfo', { headers: GetAuthHeader() });
}

const updateOwnTenantInfoHelper = (data) => {
  return axios.post(BASE_URL + 'aas/tenant/updatetenantinfo', data, { headers: GetAuthHeader() });
}

const getAllTenantUserHelper = () => {
  return axios.get(BASE_URL + 'aas/tenant/gettenantuser', { headers: GetAuthHeader() });
}

const updateTenantUserinfoHelper = (data) => {
  return axios.post(BASE_URL + 'aas/tenant/updateuserinfo', data, { headers: GetAuthHeader() });
}

const inviteUserToTenantHelper = (data) => {
  return axios.post(BASE_URL + 'aas/tenant/inviteusertotenant', data, { headers: GetAuthHeader() });
}

const removeTenantUserHelper = (data) => {
  return axios.post(BASE_URL + 'aas/tenant/removetenantuser', data, { headers: GetAuthHeader() });
}

const updateTenantlogoHelper = (file) => {
  const data = new FormData();
  data.append("image", file);
  var headers = GetAuthHeader()
  headers['Content-Type'] = "multipart/form-data";

  return axios.post(BASE_URL + 'aas/tenant/updatetenantlogo', data, { headers: headers });
}

const removeTenantlogoHelper = () => {
  return axios.post(BASE_URL + 'aas/tenant/removetenantlogo', null, { headers: GetAuthHeader() });
}

const checkTenantCodeExistHelper = (code) => {
  var params = { code: code }
  return axios.get(BASE_URL + 'aas/tenant/tenantcodeexist', { headers: GetAuthHeader(), params: params });
}

export const useCheckTenantCode = (onSuccess, onError) => {
  return useCustomMutation(checkTenantCodeExistHelper, {
    onSuccess,
    onError,
  })
}


export const useTenantInfo = (onSuccess, onError) => {
  // const queryClient = useQueryClient()
  return useCustomQuery([QUERY.TENANT_INFO], getTenantInfoHelper, {
    onSuccess,
    onError,
    select: (data) => { return data.data }
  })
}

export const useCreateTenant = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(createTenantHelper, {
    onSuccess,
    onError,
    onSettled: () => {
      queryClient.invalidateQueries(QUERY.TENANT_INFO)
    }
  })
}

export const useUpdateOwnTenantInfo = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(updateOwnTenantInfoHelper, {
    onSuccess,
    onError,
    onSettled: () => {
      queryClient.invalidateQueries(QUERY.TENANT_INFO)
    }
  })
}

export const useAllTenantUser = (onSuccess, onError) => {
  // const queryClient = useQueryClient()
  return useCustomQuery([QUERY.ALL_TENANT_USER], getAllTenantUserHelper, {
    onSuccess,
    onError,
    select: (data) => { return data.data }
  })
}

export const useUpdateTenantUserinfo = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(updateTenantUserinfoHelper, {
    onSuccess,
    onError,
    onSettled: () => {
      queryClient.invalidateQueries(QUERY.ALL_TENANT_USER)
    }
  })
}

export const useInviteTenantUser = (onSuccess, onError) => {
  return useCustomMutation(inviteUserToTenantHelper, {
    onSuccess,
    onError,
    onSettled: () => { }
  })
}

export const useRemoveTenantUser = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(removeTenantUserHelper, {
    onSuccess,
    onError,
    onSettled: () => {
      queryClient.invalidateQueries(QUERY.ALL_TENANT_USER)
    }
  })
}

export const useUpdateTenantlogo = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(updateTenantlogoHelper, {
    onSuccess,
    onError,
    onSettled: () => {
      queryClient.invalidateQueries(QUERY.TENANT_INFO)
    }
  })
}

export const useRemoveTenantlogo = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(removeTenantlogoHelper, {
    onSuccess,
    onError,
    onSettled: () => {
      queryClient.invalidateQueries(QUERY.TENANT_INFO)
    }
  })
}

class TenantService {
  async createTenant(tenantInfo) {
    return axios.post(BASE_URL + 'aas/tenant/createtenant', tenantInfo, { headers: GetAuthHeader() });
  }
}

export default TenantService;
