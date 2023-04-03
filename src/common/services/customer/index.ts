import axiosInstance from '../common/instance';

import { CustomerData, CustomerDataRequest } from './types';

export const getAllCustomerServices = async (params?: BaseFilterParams):
  Promise<APIPaginationResponse<CustomerData[]>> => {
  const res = await axiosInstance.get('customers', { params });
  return res.data;
};

export const getCustomerDetailService = async (id: number): Promise<CustomerData> => {
  const res = await axiosInstance.get(`customers/${id}`);
  return res.data.data.customer;
};

export const createCustomerService = async (data: CustomerDataRequest): Promise<void> => {
  await axiosInstance.post('customers', data);
};

export const updateCustomerService = async (
  id: number,
  data: CustomerDataRequest
): Promise<void> => {
  await axiosInstance.put(`customers/${id}`, data);
};

export const deleteCustomerService = async (params: { ids: number[] })
  : Promise<void> => {
  await axiosInstance.delete('customers', { data: params });
};
