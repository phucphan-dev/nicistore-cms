import axiosInstance from '../common/instance';

import {
  ConfigHeaderParams, ConfigHeaderTypes,
  InitialSystemData,
  SaveErrorConfigParams,
  SeoGeneralParamsTypes,
  SeoGeneralTypes,
  SystemGeneralData,
  SystemLocalesData,
  UpdateSystemGeneralParams,
  UpdateSystemLocalesParams
} from './types';

export const getConfigService = async (code: string): Promise<ConfigHeaderTypes> => {
  const res = await axiosInstance.get(`config-${code}`);
  return res.data.data;
};

export const saveConfigService = async (code: string, data: ConfigHeaderParams): Promise<void> => {
  await axiosInstance.post(`config-${code}`, data);
};

export const getSeoGeneralService = async (): Promise<SeoGeneralTypes> => {
  const res = await axiosInstance.get('seo-general');
  return res.data.data;
};

export const postSeoGeneralService = async (params: SeoGeneralParamsTypes) => {
  const res = await axiosInstance.post('seo-general', params);
  return res.data;
};

export const getSystemInitialService = async (): Promise<InitialSystemData> => {
  const res = await axiosInstance.get('initial');
  return res.data.data;
};

export const getSystemLocalesService = async (): Promise<SystemLocalesData> => {
  const res = await axiosInstance.get('system-locales');
  return res.data.data;
};

export const updateSystemLocalesService = async (params: UpdateSystemLocalesParams):
  Promise<void> => {
  await axiosInstance.post('system-locales', params);
};

export const getSystemGeneralService = async ():
  Promise<SystemGeneralData> => {
  const res = await axiosInstance.get('system-general');
  return res.data.data;
};

export const updateSystemGeneralService = async (params: UpdateSystemGeneralParams):
  Promise<void> => {
  const bodyForm = new FormData();
  Object.entries(params).forEach(([key, value]) => {
    if (value ?? false) {
      bodyForm.append(key, value);
    } else {
      bodyForm.append(key, '');
    }
  });

  await axiosInstance.post('system-general', bodyForm);
};

export const getErrorConfigService = async (id: string):
  Promise<ConfigHeaderTypes> => {
  const res = await axiosInstance.get(`errors-pages/${id}`);
  return res.data.data;
};

export const saveErrorConfigService = async (id: string, data: SaveErrorConfigParams):
  Promise<void> => {
  await axiosInstance.post(`errors-pages/${id}`, data);
};
