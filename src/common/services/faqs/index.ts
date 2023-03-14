import axiosInstance from '../common/instance';

import {
  CreateFaqCategoriesParamsTypes,
  CreateFaqCategoryCommentParams,
  CreateFaqCategoryCommentType,
  CreateFaqCommentParams,
  CreateFaqCommentType,
  CreateFaqParamsTypes,
  FaqCategoryCommentType,
  FaqCategoryDetailTypes,
  FaqCategoryTypes,
  FaqCommentType,
  FaqDetailTypes,
  FaqTypes,
  GetAllFaqsParamsTypes,
  GetFaqByIdParamsTypes,
  GetFaqCategoryByIdParamsTypes,
  GetFaqCategoryCommentParams,
  GetFaqCommentParams,
} from './types';

/* FAQ */
export const getAllFaqsService = async (params?: GetAllFaqsParamsTypes)
  : Promise<APIPaginationResponse<FaqTypes[]>> => {
  const res = await axiosInstance.get('faqs', { params });
  return res.data;
};

export const getFaqByIdService = async ({ id, ...params }: GetFaqByIdParamsTypes)
  : Promise<FaqDetailTypes> => {
  const res = await axiosInstance.get(`faqs/${id}`, { params });
  return res.data.data;
};

export const createFaqService = async (params: CreateFaqParamsTypes)
  : Promise<{ id: number }> => {
  const res = await axiosInstance.post('faqs', params);
  return res.data.data;
};

export const updateFaqService = async (id: number, params: CreateFaqParamsTypes)
  : Promise<unknown> => {
  const res = await axiosInstance.put(`faqs/${id}`, params);
  return res.data;
};

export const updateStatusFaqService = async (id: number, status: number)
  : Promise<void> => {
  await axiosInstance.put(`faqs/${id}/update-status`, { status });
};

export const changeStatusFaqManyIdService = async (ids: number[], status: number)
  : Promise<void> => {
  await axiosInstance.put('faqs/update-status-with-many-id', { status, ids });
};

export const deleteFaqService = async (params: { ids: number[] })
  : Promise<unknown> => {
  const res = await axiosInstance.delete('faqs', { data: params });
  return res.data;
};

export const getFaqCommentService = async (params: GetFaqCommentParams)
  : Promise<APIPaginationResponse<FaqCommentType[]>> => {
  const res = await axiosInstance.get('faq-comments', { params });
  return res.data;
};

export const createFaqCommentService = async (params: CreateFaqCommentParams)
  : Promise<CreateFaqCommentType> => {
  const res = await axiosInstance.post('faq-comments', params);
  return res.data;
};

/* FAQ-CATEGORY */
export const getAllFaqCategoriesService = async (params?: GetAllFaqsParamsTypes)
  : Promise<APIPaginationResponse<FaqCategoryTypes[]>> => {
  const res = await axiosInstance.get('faq-categories', { params });
  return res.data;
};

export const getFaqCategoryByIdService = async ({ id, ...params }: GetFaqCategoryByIdParamsTypes)
  : Promise<FaqCategoryDetailTypes> => {
  const res = await axiosInstance.get(`faq-categories/${id}`, { params });
  return res.data.data;
};

export const createFaqCategoriesService = async (params?: CreateFaqCategoriesParamsTypes)
  : Promise<{ id: number }> => {
  const res = await axiosInstance.post('faq-categories', params);
  return res.data.data;
};

export const deleteFaqCategoriesService = async (params: { ids: number[] })
  : Promise<unknown> => {
  const res = await axiosInstance.delete('faq-categories', { data: params });
  return res.data;
};

export const updateFaqCategoriesService = async (
  id: number,
  params?: CreateFaqCategoriesParamsTypes
): Promise<unknown> => {
  const res = await axiosInstance.put(`faq-categories/${id}`, params);
  return res.data;
};

export const updateStatusFaqCategoryService = async (id: number, status: number)
  : Promise<void> => {
  await axiosInstance.put(`faq-categories/${id}/update-status`, { status });
};

export const changeStatusFaqCategoryManyIdService = async (ids: number[], status: number)
  : Promise<void> => {
  await axiosInstance.put('faq-categories/update-status-with-many-id', { status, ids });
};

export const getFaqCategoryCommentService = async (params: GetFaqCategoryCommentParams)
  : Promise<APIPaginationResponse<FaqCategoryCommentType[]>> => {
  const res = await axiosInstance.get('faq-category-comments', { params });
  return res.data;
};

export const createFaqCategoryCommentService = async (params: CreateFaqCategoryCommentParams)
  : Promise<CreateFaqCategoryCommentType> => {
  const res = await axiosInstance.post('faq-category-comments', params);
  return res.data;
};
