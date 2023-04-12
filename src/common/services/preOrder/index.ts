import axiosInstance from '../common/instance';

import { PreOrderData, PreOrderDataRequest, PreOrderItemData } from './types';

export const getAllPreOrderService = async (params?: BaseFilterParams):
  Promise<APIPaginationResponse<PreOrderItemData[]>> => {
  const res = await axiosInstance.get('represent-orders', { params });
  return res.data;
};

export const createPreOrderService = async (
  params: PreOrderDataRequest
) => {
  const res = await axiosInstance.post('represent-orders', params);
  return res.data.data;
};

export const deletePreOrderService = async (params: { ids: number[] })
  : Promise<void> => {
  await axiosInstance.delete('represent-orders', { data: params });
};

export const getPreOrderByIdService = async (id: number)
  : Promise<PreOrderData> => {
  const res = await axiosInstance.get(`represent-orders/${id}`);
  return res.data.data;
};

export const updatePreOrderByIdService = async (
  id: number,
  params: PreOrderDataRequest
): Promise<void> => {
  await axiosInstance.put(`represent-orders/${id}`, params);
};
