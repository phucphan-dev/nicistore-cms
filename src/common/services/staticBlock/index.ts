import axiosInstance from '../common/instance';

import {
  CreateStaticBlockParams, StaticBlockDataType, StaticBlockItemListType, StaticBlockTemplateType
} from './types';

export const getStaticBlockTemplateService = async (): Promise<StaticBlockTemplateType[]> => {
  const res = await axiosInstance.get('static-blocks/templates');
  return res.data.data;
};

export const getAllStaticBlockService = async (params: BaseFilterParams):
  Promise<APIPaginationResponse<StaticBlockItemListType[]>> => {
  const res = await axiosInstance.get('static-blocks', { params });
  return res.data;
};

export const getDetailStaticBlockService = async (id: number, locale: string):
  Promise<StaticBlockDataType> => {
  const res = await axiosInstance.get(`static-blocks/${id}`, { params: { locale } });
  return res.data.data;
};

export const createStaticBlockService = async (params: CreateStaticBlockParams):
  Promise<{ id: number }> => {
  const res = await axiosInstance.post('static-blocks', params);
  return res.data.data;
};

export const updateStaticBlockService = async (id: number, params: CreateStaticBlockParams):
  Promise<void> => {
  await axiosInstance.put(`static-blocks/${id}`, params);
};

export const deleteStaticBlockService = async (
  ids: number[]
): Promise<void> => {
  await axiosInstance.delete('static-blocks', { data: { ids } });
};
