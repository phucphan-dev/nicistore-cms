import axiosInstance from '../common/instance';

import {
  CreateRedirectParams,
  DeleteRedirectParams,
  GetRedirectParams,
  ImportRedirectParams,
  PreviewImportDataType,
  PreviewImportRedirectParams,
  RedirectDataType,
  UpdateRedirectParams
} from './types';

export const getAllRedirectsService = async (
  params?: BaseFilterParams
): Promise<APIPaginationResponse<RedirectDataType[]>> => {
  const res = await axiosInstance.get('redirects', { params });
  return res.data;
};

export const getRedirectsService = async (
  params: GetRedirectParams,
): Promise<RedirectDataType> => {
  const res = await axiosInstance.get('redirects', { params });
  return res.data.data;
};

export const createRedirectsService = async (
  params: CreateRedirectParams,
): Promise<RedirectDataType> => {
  const res = await axiosInstance.post('redirects', params);
  return res.data.data;
};

export const updateRedirectsService = async (
  params: UpdateRedirectParams,
): Promise<RedirectDataType> => {
  const { id, ...rest } = params;
  const res = await axiosInstance.put(`redirects/${id}`, { ...rest });
  return res.data.data;
};

export const deleteRedirectsService = async (
  params: DeleteRedirectParams,
): Promise<RedirectDataType> => {
  const res = await axiosInstance.delete('redirects', { data: params });
  return res.data.data;
};

export const previewImportRedirectsService = async (
  params: PreviewImportRedirectParams,
): Promise<PreviewImportDataType[]> => {
  const bodyForm = new FormData();
  bodyForm.append('file', params.file);

  const res = await axiosInstance.post('redirects/import-preview', bodyForm);
  return res.data.data;
};

export const importRedirectsService = async (
  params: ImportRedirectParams,
): Promise<void> => {
  const bodyForm = new FormData();
  bodyForm.append('file', params.file);

  await axiosInstance.post('redirects/import', bodyForm);
};
