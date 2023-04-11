import axiosInstance from '../common/instance';

import { CouponData, CouponItemData } from './types';

export const createCouponService = async (data: CouponData): Promise<void> => {
  await axiosInstance.post('coupons', data);
};

export const getAllCouponService = async (params?: BaseFilterParams):
  Promise<APIPaginationResponse<CouponItemData[]>> => {
  const res = await axiosInstance.get('coupons', { params });
  return res.data;
};

export const getCouponDetailService = async (id: number): Promise<CouponItemData> => {
  const res = await axiosInstance.get(`coupons/${id}`);
  return res.data.data;
};

export const updateCouponService = async (
  id: number,
  data: CouponData
): Promise<CouponData> => {
  const res = await axiosInstance.put(`coupons/${id}`, data);
  return res.data.data;
};

export const deleteCouponService = async (params: { ids: number[] })
  : Promise<void> => {
  await axiosInstance.delete('coupon', { data: params });
};
