import axiosInstance from '../common/instance';

import {
  ActivityLogsActionsData,
  ActivityLogsDataType,
  ActivityLogsUserData,
  GetAllActivityLogsParams,
} from './types';

export const getAllActivityLogsService = async (
  params?: GetAllActivityLogsParams
): Promise<APIPaginationResponse<ActivityLogsDataType[]>> => {
  const res = await axiosInstance.get('activity-logs', { params });
  return res.data;
};

export const getAllActivityLogsActionsService = async (): Promise<ActivityLogsActionsData> => {
  const res = await axiosInstance.get('activity-logs/actions');
  return res.data.data;
};

export const getAllActivityLogsUsersService = async (): Promise<ActivityLogsUserData[]> => {
  const res = await axiosInstance.get('activity-logs/users');
  return res.data.data;
};
