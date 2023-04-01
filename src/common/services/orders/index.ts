import axiosInstance from '../common/instance';

import { OrderDataTypes } from './types';

export const getAllOrderService = async (params?: BaseFilterParams):
  Promise<APIPaginationResponse<OrderDataTypes[]>> => {
  const res = await axiosInstance.get('orders', { params });
  return res.data;
};

export const getOrderDetailService = async (id: number): Promise<OrderDataTypes> => {
  const res = await axiosInstance.get(`orders/${id}`);
  return res.data.data;
};
