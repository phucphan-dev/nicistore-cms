import axiosInstance from '../common/instance';

import { CreateUpdateProductCategoryTypes, ProductCategoryItemTypes } from './types';

export const getAllProductCategories = async (params?: BaseFilterParams):
  Promise<APIPaginationResponse<ProductCategoryItemTypes[]>> => {
  const res = await axiosInstance.get('product-categories', { params });
  return res.data;
};

export const createProductCategoryService = async (
  params: CreateUpdateProductCategoryTypes
) => {
  const res = await axiosInstance.post('product-categories', params);
  return res.data.data;
};
