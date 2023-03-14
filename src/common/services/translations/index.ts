import axiosInstance from '../common/instance';

import {
  TranslationsTypes, GetTranslationsParamsTypes, UpdateTranslationsParamsTypes,
} from './types';

export const getFETranslationsService = async (params?: GetTranslationsParamsTypes)
  : Promise<APIPaginationResponse<TranslationsTypes[]>> => {
  const res = await axiosInstance.get('fe-translations', { params });
  return res.data;
};

export const updateFETranslationsService = async ({
  id,
  ...params
}: UpdateTranslationsParamsTypes)
  : Promise<APIPaginationResponse<TranslationsTypes[]>> => {
  const res = await axiosInstance.put(`fe-translations/${id}`, params);
  return res.data;
};

export const getCMSTranslationsService = async (params?: GetTranslationsParamsTypes)
  : Promise<APIPaginationResponse<TranslationsTypes[]>> => {
  const res = await axiosInstance.get('cms-translations', { params });
  return res.data;
};

export const updateCMSTranslationsService = async ({
  id,
  ...params
}: UpdateTranslationsParamsTypes)
  : Promise<APIPaginationResponse<TranslationsTypes[]>> => {
  const res = await axiosInstance.put(`cms-translations/${id}`, params);
  return res.data;
};
