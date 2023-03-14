import axiosInstance from '../common/instance';

import {
  CreateRoleParams,
  DeleteRoleParams,
  GetAllRolesParams,
  GetRoleParams,
  PermissionData,
  RoleData,
  RoleDetailData,
  UpdateRoleParams,
} from './types';

export const getAllPermissionsService = async ():
  Promise<PermissionData> => {
  const res = await axiosInstance.get('roles/permissions');
  return res.data.data;
};

export const getAllRolesService = async (
  params?: GetAllRolesParams,
): Promise<APIPaginationResponse<RoleData[]>> => {
  const res = await axiosInstance.get('roles', { params });
  return res.data;
};

export const getRoleService = async (
  params: GetRoleParams,
): Promise<RoleDetailData> => {
  const res = await axiosInstance.get(`roles/${params.id}`);
  return res.data.data;
};

export const createRoleService = async (
  params: CreateRoleParams,
): Promise<void> => {
  await axiosInstance.post('roles', params);
};

export const updateRoleService = async (
  params: UpdateRoleParams,
): Promise<void> => {
  const { id, ...rest } = params;
  await axiosInstance.put(`roles/${id}`, { ...rest });
};

export const deleteRoleService = async (
  params: DeleteRoleParams,
): Promise<void> => {
  await axiosInstance.delete('roles', { data: params });
};
