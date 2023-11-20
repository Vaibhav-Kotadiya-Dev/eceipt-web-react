import axios from 'axios';
import { QUERY } from 'aas/common/constant';
import { GetAuthHeader } from 'aas/common/functions';
import useCustomMutation from 'common/hooks/useCustomMutation';
import useCustomQuery from 'common/hooks/useCustomQuery';
import { API_URL } from "config"
import { useQueryClient } from 'react-query';

const BASE_URL = API_URL.AAS_URL;

const getAllPackagesDetailHelper = () => {
    return axios.get(BASE_URL + 'aas/subscription/getpackagesdetail', { headers: GetAuthHeader() });
}

const getPackagesDetailByCodeHelper = ({ queryKey }) => {
    var params = { code: queryKey[1] }
    if (queryKey[1] != null) {
        return axios.get(BASE_URL + 'aas/subscription/getpackagesdetailbycode', { headers: GetAuthHeader(), params: params });
    }
}

const getPackagesListHelper = () => {
    return axios.get(BASE_URL + 'aas/subscription/getpackageslist', { headers: GetAuthHeader() });
}

const getAllServicesHelper = () => {
    return axios.get(BASE_URL + 'aas/subscription/getservices', { headers: GetAuthHeader() });
}

const getAllServiceGroupHelper = () => {
    return axios.get(BASE_URL + 'aas/subscription/getservicegroup', { headers: GetAuthHeader() });
}

const getServiceGroupByCodeHelper = (code) => {
    if (code === null) {
        return null
    }

    var params = { code: code }
    return axios.get(BASE_URL + 'aas/subscription/getservicegroupbycode', { headers: GetAuthHeader(), params: params });
}

const addServiceHelper = (service) => {
    return axios.post(BASE_URL + 'aas/subscription/addservice', service, { headers: GetAuthHeader() });
}

const removeServiceHelper = (service) => {
    return axios.post(BASE_URL + 'aas/subscription/removeservice', service, { headers: GetAuthHeader() });
}

const addGroupServiceHelper = (data) => {
    return axios.post(BASE_URL + 'aas/subscription/addgroupservice', data, { headers: GetAuthHeader() });
}

const removeGroupServiceHelper = (data) => {
    return axios.post(BASE_URL + 'aas/subscription/removegroupservice', data, { headers: GetAuthHeader() });
}

const addPackageGroupHelper = (data) => {
    return axios.post(BASE_URL + 'aas/subscription/addpackagegroup', data, { headers: GetAuthHeader() });
}

const removePackageGroupHelper = (data) => {
    return axios.post(BASE_URL + 'aas/subscription/removepackagegroup', data, { headers: GetAuthHeader() });
}

export const useAllPackagesDetail = (onSuccess, onError) => {
    // const queryClient = useQueryClient()
    return useCustomQuery([QUERY.ALL_PACKAGE_DETAIL], getAllPackagesDetailHelper, {
        onSuccess,
        onError,
        select: (data) => { return data.data }
    })
}

export const usePackagesDetailByCode = (code, onSuccess, onError) => {
    // const queryClient = useQueryClient()
    return useCustomQuery([QUERY.PACKAGE_DETAIL, code], getPackagesDetailByCodeHelper, {
        onSuccess,
        onError,
        select: (data) => { return data.data },
        enabled: code !== undefined && code !== null
        // enabled: false
    })
}

export const usePackagesList = (onSuccess, onError) => {
    // const queryClient = useQueryClient()
    return useCustomQuery([QUERY.PACKAGE_LIST], getPackagesListHelper, {
        onSuccess,
        onError,
        select: (data) => { return data.data }
    })
}

export const useAllServices = (onSuccess, onError) => {
    // const queryClient = useQueryClient()
    return useCustomQuery([QUERY.ALL_SERVICES], getAllServicesHelper, {
        onSuccess,
        onError,
        select: (data) => { return data.data }
    })
}

export const useAllServiceGroup = (onSuccess, onError) => {
    // const queryClient = useQueryClient()
    return useCustomQuery([QUERY.ALL_SERVICES_GROUP], getAllServiceGroupHelper, {
        onSuccess,
        onError,
        select: (data) => { return data.data }
    })
}

export const useServiceGroupByCode = (code, onSuccess, onError) => {
    // const queryClient = useQueryClient()
    // console.log(code)
    return useCustomQuery([QUERY.SERVICES_GROUP, code], () => getServiceGroupByCodeHelper(code), {
        onSuccess,
        onError,
        select: (data) => { return data.data },
        enabled: code !== undefined && code !== null,
    })
}

export const useAddService = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(addServiceHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.PACKAGE_DETAIL)
            queryClient.invalidateQueries(QUERY.ALL_SERVICES)
            queryClient.invalidateQueries(QUERY.ALL_SERVICES_GROUP)
            queryClient.invalidateQueries(QUERY.SERVICES_GROUP)
        }
    })
}

export const useRemoveService = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(removeServiceHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.PACKAGE_DETAIL)
            queryClient.invalidateQueries(QUERY.ALL_SERVICES)
            queryClient.invalidateQueries(QUERY.ALL_SERVICES_GROUP)
            queryClient.invalidateQueries(QUERY.SERVICES_GROUP)
        }
    })
}

export const useAddGroupService = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(addGroupServiceHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.PACKAGE_DETAIL)
            queryClient.invalidateQueries(QUERY.ALL_SERVICES_GROUP)
            queryClient.invalidateQueries(QUERY.SERVICES_GROUP)
        }
    })
}

export const useRemoveGroupService = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(removeGroupServiceHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.PACKAGE_DETAIL)
            queryClient.invalidateQueries(QUERY.ALL_SERVICES_GROUP)
            queryClient.invalidateQueries(QUERY.SERVICES_GROUP)
        }
    })
}

export const useAddPackageGroup = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(addPackageGroupHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.PACKAGE_DETAIL)
            queryClient.invalidateQueries(QUERY.ALL_SERVICES_GROUP)
        }
    })
}

export const useRemovePackageGroup = (onSuccess, onError) => {
    const queryClient = useQueryClient()
    return useCustomMutation(removePackageGroupHelper, {
        onSuccess,
        onError,
        onSettled: () => {
            queryClient.invalidateQueries(QUERY.PACKAGE_DETAIL)
            queryClient.invalidateQueries(QUERY.ALL_SERVICES_GROUP)
        }
    })
}