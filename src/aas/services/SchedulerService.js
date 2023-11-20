import axios from 'axios';
import { useQueryClient } from 'react-query';

import { API_URL } from "config"

import { GetAuthHeader } from 'aas/common/functions';
import { QUERY } from 'aas/common/constant';
import useCustomQuery from 'common/hooks/useCustomQuery';
import useCustomMutation from 'common/hooks/useCustomMutation';

const BASE_URL = API_URL.SCHEDULER_BASE_URL

const getAllScheduleHelper = () => {
  return axios.get(BASE_URL + 'scheduler/job/getall', { headers: GetAuthHeader() });
}

const getSchedulerLogHelper = () => {
  return axios.get(BASE_URL + 'scheduler/log/get100logs', { headers: GetAuthHeader() });
}

const createUpdateScheduleHelper = (schedule) => {
  return axios.post(BASE_URL + 'scheduler/job/create', schedule, { headers: GetAuthHeader() });
}

const pauseScheduleHelper = (id) => {
  var params = { id: id }
  return axios.post(BASE_URL + 'scheduler/job/pause', null, { headers: GetAuthHeader(), params: params });
}

const resumeScheduleHelper = (id) => {
  var params = { id: id }
  return axios.post(BASE_URL + 'scheduler/job/resume', null, { headers: GetAuthHeader(), params: params });
}

const deleteScheduleHelper = (id) => {
  var params = { id: id }
  return axios.post(BASE_URL + 'scheduler/job/delete', null, { headers: GetAuthHeader(), params: params });
}

export const useAllScheduleInfo = (onSuccess, onError) => {
  return useCustomQuery([QUERY.SCHEDULER_JOB_INFO_ALL], getAllScheduleHelper, {
    onSuccess,
    onError,
    select: (data) => { return data.data },
    enabled: true
  })
}
export const useSchedulerLogs = (onSuccess, onError) => {
  return useCustomQuery([QUERY.SCHEDULER_LOGS], getSchedulerLogHelper, {
    onSuccess,
    onError,
    select: (data) => { return data.data },
    enabled: true
  })
}

export const useCreateUpdateSchedule = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(createUpdateScheduleHelper, {
    onSuccess,
    onError,
    onSettled: () => {
      queryClient.invalidateQueries(QUERY.SCHEDULER_JOB_INFO_ALL)
    }
  })
}
export const usePauseSchedule = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(pauseScheduleHelper, {
    onSuccess,
    onError,
    onSettled: () => {
      queryClient.invalidateQueries(QUERY.SCHEDULER_JOB_INFO_ALL)
    }
  })
}
export const useResumeSchedule = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(resumeScheduleHelper, {
    onSuccess,
    onError,
    onSettled: () => {
      queryClient.invalidateQueries(QUERY.SCHEDULER_JOB_INFO_ALL)
    }
  })
}
export const useDeleteSchedule = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(deleteScheduleHelper, {
    onSuccess,
    onError,
    onSettled: () => {
      queryClient.invalidateQueries(QUERY.SCHEDULER_JOB_INFO_ALL)
    }
  })
}
