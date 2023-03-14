import axiosInstance from '../common/instance';

import {
  CreateFormManagementParams,
  DeleteFormManagementParams,
  GetAllFormManagementParams,
  GetFormManagementParams,
  FormManagementDataType,
  UpdateFormManagementParams,
  FormManagementDetailType
} from './types';

export const getAllFormManagementService = async (
  params?: GetAllFormManagementParams
): Promise<APIPaginationResponse<FormManagementDataType[]>> => {
  const res = await axiosInstance.get('form-managements', { params });
  return res.data;
};

export const getFormManagementService = async (
  params: GetFormManagementParams,
): Promise<FormManagementDetailType> => {
  const { id, ...rest } = params;
  const res = await axiosInstance.get(`form-managements/${id}`, { params: rest });
  return res.data.data;
};

export const createFormManagementService = async (
  params: CreateFormManagementParams,
): Promise<FormManagementDataType> => {
  const res = await axiosInstance.post('form-managements', params);
  return res.data.data;
};

export const updateFormManagementService = async (
  params: UpdateFormManagementParams,
): Promise<FormManagementDataType> => {
  const { id, ...rest } = params;
  const res = await axiosInstance.put(`form-managements/${id}`, { ...rest });
  return res.data.data;
};

export const deleteFormManagementService = async (
  params: DeleteFormManagementParams,
): Promise<FormManagementDataType> => {
  const res = await axiosInstance.delete('form-managements', { data: params });
  return res.data.data;
};
