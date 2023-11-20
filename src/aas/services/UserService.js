import axios from 'axios';
import { GetAuthHeader } from 'aas/common/functions';
import { API_URL } from "config"
import useCustomQuery from 'common/hooks/useCustomQuery';
import { QUERY } from 'aas/common/constant';
import { useQueryClient } from 'react-query';
import useCustomMutation from 'common/hooks/useCustomMutation';

const BASE_URL = API_URL.AAS_URL;

const getOwnInfoHelper = () => {
  return axios.get(BASE_URL + 'aas/user/getowninfo', { headers: GetAuthHeader() });
}

const getUserLanguageHelper = () => {
  return axios.get(BASE_URL + 'aas/user/getuserlang', { headers: GetAuthHeader() });
}

const updateUserLanguageHelper = (lang) => {
  var parms = { lang: lang }
  return axios.post(BASE_URL + 'aas/user/updateuserlang', null, { headers: GetAuthHeader(), params: parms });
}

const updateProfileImageHelper = (file) => {
  const data = new FormData();
  data.append("image", file);
  var headers = GetAuthHeader()
  headers['Content-Type'] = "multipart/form-data";

  return axios.post(BASE_URL + 'aas/user/updateprofileimage', data, { headers: headers });
}

const removeProfileImageHelper = () => {
  return axios.post(BASE_URL + 'aas/user/removeprofileimage', null, { headers: GetAuthHeader() });
}

const updateUserOwnInfoHelper = (data) => {
  return axios.post(BASE_URL + 'aas/user/updateuserowninfo', data, { headers: GetAuthHeader() });
}

const changePasswordHelper = (data) => {
  return axios.post(BASE_URL + 'aas/user/changepassword', data, { headers: GetAuthHeader() });
}

export const useOwnInfo = (onSuccess, onError) => {
  // const queryClient = useQueryClient()
  return useCustomQuery([QUERY.USER_LANGUAGE], getOwnInfoHelper, {
    onSuccess,
    onError,
    select: (data) => { return data.data },
    enabled: true
  })
}

export const useUserLanguage = (onSuccess, onError) => {
  return useCustomQuery([QUERY.OWN_INFO], getUserLanguageHelper, {
    onSuccess,
    onError,
    select: (data) => { return data.data },
  })
}

export const useUpdateUserLanguage = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(updateUserLanguageHelper, {
    onSuccess,
    onError,
    onSettled: () => {
      queryClient.invalidateQueries(QUERY.USER_LANGUAGE)
    }
  })
}

export const useUpdateProfileImage = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(updateProfileImageHelper, {
    onSuccess,
    onError,
    onSettled: () => {
      queryClient.invalidateQueries(QUERY.OWN_INFO)
    }
  })
}

export const useRemoveProfileImage = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(removeProfileImageHelper, {
    onSuccess,
    onError,
    onSettled: () => {
      queryClient.invalidateQueries(QUERY.OWN_INFO)
    }
  })
}

export const useUpdateOwnInfo = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(updateUserOwnInfoHelper, {
    onSuccess,
    onError,
    onSettled: () => {
      queryClient.invalidateQueries(QUERY.OWN_INFO)
    }
  })
}

export const useChangePassword = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(changePasswordHelper, {
    onSuccess,
    onError,
    onSettled: () => {
      queryClient.invalidateQueries(QUERY.OWN_INFO)
    }
  })
}

class UserService {
  async getOwnInfo() {
    return axios.get(BASE_URL + 'aas/user/getowninfo', { headers: GetAuthHeader() });
  }
}

export default UserService;
