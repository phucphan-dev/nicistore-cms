import axiosInstance from '../common/instance';

import {
  CreateUpdateProductCategoryTypes,
  CreateUpdateProductColorTypes,
  CreateUpdateProductSizeTypes,
  CreateUpdateProductTypes,
  ProductCategoryItemTypes, ProductColorItemTypes, ProductItemTypes, ProductSizeItemTypes
} from './types';

/* Categories */
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

export const deleteProductCategoriesService = async (params: { ids: number[] })
  : Promise<void> => {
  await axiosInstance.delete('product-categories', { data: params });
};

export const getProductCategoryByIdService = async (id: number)
  : Promise<ProductCategoryItemTypes> => {
  const res = await axiosInstance.get(`product-categories/${id}`);
  return res.data.data;
};

export const updateProductCategoryByIdService = async (
  id: number,
  params: CreateUpdateProductCategoryTypes
): Promise<void> => {
  await axiosInstance.put(`product-categories/${id}`, params);
};

/* Products */
export const getAllProductService = async (params?: BaseFilterParams):
  Promise<APIPaginationResponse<ProductItemTypes[]>> => {
  const res = await axiosInstance.get('products', { params });
  return res.data;
};

export const createProductService = async (
  params: CreateUpdateProductTypes
) => {
  const res = await axiosInstance.post('products', params);
  return res.data.data;
};

export const deleteProductService = async (params: { ids: number[] })
  : Promise<void> => {
  await axiosInstance.delete('products', { data: params });
};

export const getProductByIdService = async (id: number)
  : Promise<ProductItemTypes> => {
  const res = await axiosInstance.get(`products/${id}`);
  return res.data.data;
};

export const updateProductByIdService = async (
  id: number,
  params: CreateUpdateProductTypes
): Promise<void> => {
  await axiosInstance.put(`products/${id}`, params);
};

/* Colors */
export const getAllProductColors = async (params?: BaseFilterParams):
  Promise<APIPaginationResponse<ProductColorItemTypes[]>> => {
  const res = await axiosInstance.get('product-colors', { params });
  return res.data;
};

export const createProductColorService = async (
  params: CreateUpdateProductColorTypes
) => {
  const res = await axiosInstance.post('product-colors', params);
  return res.data.data;
};

export const deleteProductColorsService = async (params: { ids: number[] })
  : Promise<void> => {
  await axiosInstance.delete('product-colors', { data: params });
};

export const getProductColorByIdService = async (id: number)
  : Promise<ProductColorItemTypes> => {
  const res = await axiosInstance.get(`product-colors/${id}`);
  return res.data.data;
};

export const updateProductColorByIdService = async (
  id: number,
  params: CreateUpdateProductColorTypes
): Promise<void> => {
  await axiosInstance.put(`product-colors/${id}`, params);
};

/* Sizes */
export const getAllProductSizes = async (params?: BaseFilterParams):
  Promise<APIPaginationResponse<ProductSizeItemTypes[]>> => {
  const res = await axiosInstance.get('product-sizes', { params });
  return res.data;
};

export const createProductSizeService = async (
  params: CreateUpdateProductSizeTypes
) => {
  const res = await axiosInstance.post('product-sizes', params);
  return res.data.data;
};

export const deleteProductSizesService = async (params: { ids: number[] })
  : Promise<void> => {
  await axiosInstance.delete('product-sizes', { data: params });
};

export const getProductSizeByIdService = async (id: number)
  : Promise<ProductSizeItemTypes> => {
  const res = await axiosInstance.get(`product-sizes/${id}`);
  return res.data.data;
};

export const updateProductSizeByIdService = async (
  id: number,
  params: CreateUpdateProductSizeTypes
): Promise<void> => {
  await axiosInstance.put(`product-sizes/${id}`, params);
};
