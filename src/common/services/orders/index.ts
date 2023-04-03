import axiosInstance from '../common/instance';

import {
  CustomerShippingAddress, OrderCustomer, OrderDataRequest, OrderDataTypes
} from './types';

export const getAllOrderService = async (params?: BaseFilterParams):
  Promise<APIPaginationResponse<OrderDataTypes[]>> => {
  const res = await axiosInstance.get('orders', { params });
  return res.data;
};

export const getOrderDetailService = async (id: number): Promise<OrderDataTypes> => {
  const res = await axiosInstance.get(`orders/${id}`);
  return res.data.data;
};

export const createOrderService = async (data: OrderDataRequest): Promise<OrderDataTypes> => {
  const res = await axiosInstance.post('orders', { data });
  return res.data.data;
};

export const updateOrderService = async (
  id: number,
  data: OrderDataRequest
): Promise<OrderDataTypes> => {
  const res = await axiosInstance.put(`orders/${id}`, { data });
  return res.data.data;
};

export const getOrderCustomerService = async (): Promise<OrderCustomer[]> => {
  const res = await axiosInstance.get('orders/customers');
  return res.data.data;
};

export const getShippingAddressCustomerService = async (
  customer_id: number
): Promise<CustomerShippingAddress[]> => {
  const res = await axiosInstance.get(`orders/shipping-address/${customer_id}`);
  return res.data.data;
};
