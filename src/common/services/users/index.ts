import axiosInstance from '../common/instance';

import {
  CreateUserParams,
  UpdateUserParams,
  UserDataType,
  UserDetailDataType,
} from './types';

export const getAllUsersService = async (
  params?: BaseFilterParams,
): Promise<APIPaginationResponse<UserDataType[]>> => {
  const res = await axiosInstance.get('users', { params });
  return res.data;
};

export const getUserService = async (
  id: number,
): Promise<UserDetailDataType> => {
  const res = await axiosInstance.get(`users/${id}`);
  return res.data.data;
};

export const deleteUserService = async (
  ids: number[],
): Promise<void> => {
  await axiosInstance.delete('users', { data: { ids } });
};

export const createUserService = async (
  params: CreateUserParams,
): Promise<void> => {
  await axiosInstance.post('users', params);
};

export const updateUserService = async (
  params: UpdateUserParams,
): Promise<void> => {
  await axiosInstance.put(`users/${params.id}`, params);
};
