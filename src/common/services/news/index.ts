import axiosInstance from '../common/instance';

import {
  CreateNewsCategoryCommentParams,
  CreateNewsCategoryCommentType,
  CreateNewsCommentParams,
  CreateNewsCommentType,
  CreateUpdateNewsCategoryByIdParamsTypes,
  CreateUpdateNewsParamsTypes, DeleteNewsParamsTypes,
  GetAllNewsCategoryTypes,
  GetAllNewsServiceTypes,
  GetNewsByIdParamsTypes,
  GetNewsCategoryByIdTypes,
  GetNewsCategoryCommentParams,
  GetNewsCommentParams,
  NewsByIdDataTypes,
  NewsCategoryByIdParams,
  NewsCategoryCommentType,
  NewsCommentType,
  PreviewNewsReponse
} from './types';

/* NEWS */
export const getNewsService = async (params?: BaseFilterParams):
  Promise<APIPaginationResponse<GetAllNewsServiceTypes[]>> => {
  const res = await axiosInstance.get('news', { params });
  return res.data;
};

export const getNewsByIdService = async (
  params: GetNewsByIdParamsTypes
): Promise<NewsByIdDataTypes> => {
  const res = await axiosInstance.get(`news/${params.id}?locale=${params.locale}`);
  return res.data.data;
};

export const deleteNewsService = async (params: DeleteNewsParamsTypes) => axiosInstance.delete('news', { data: params });
export const deleteNewsTranslationService = async (params: DeleteNewsParamsTypes) => axiosInstance.delete('news/translations', { data: params });

export const updateNewsByIdService = async (id: number, params: CreateUpdateNewsParamsTypes) => axiosInstance.put(`news/${id}`, params);

export const createNewsService = async (params: CreateUpdateNewsParamsTypes):
  Promise<{ id: number }> => {
  const response = await axiosInstance.post('news', params);
  return response.data.data;
};

export const previewNewsService = async (
  params: CreateUpdateNewsParamsTypes
): Promise<PreviewNewsReponse> => {
  const response = await axiosInstance.post('news/preview', params);
  return response.data.data;
};

export const updateNewsStatusService = async (id: number, status: number): Promise<void> => {
  await axiosInstance.put(`news/${id}/update-status`, { status });
};

export const changeStatusManyIdService = async (ids: number[], status: number): Promise<void> => {
  await axiosInstance.put('news/update-status-with-many-id', { status, ids });
};

export const getNewsCommentService = async (params: GetNewsCommentParams)
  : Promise<APIPaginationResponse<NewsCommentType[]>> => {
  const res = await axiosInstance.get('news-comments', { params });
  return res.data;
};
export const createNewsCommentService = async (params: CreateNewsCommentParams)
  : Promise<CreateNewsCommentType> => {
  const res = await axiosInstance.post('news-comments', params);
  return res.data;
};

/* NEWS-CATEGORY */
export const getAllNewsCategoryService = async (params?: BaseFilterParams):
  Promise<APIPaginationResponse<GetAllNewsCategoryTypes[]>> => {
  const res = await axiosInstance.get('news-categories', { params });
  return res.data;
};

export const getNewsCategoryByIdService = async (
  params: NewsCategoryByIdParams
): Promise<GetNewsCategoryByIdTypes> => {
  const res = await axiosInstance.get(`news-categories/${params.id}?locale=${params.locale}`);
  return res.data.data;
};

export const updateNewsCategoryByIdService = async (
  id: number,
  params: CreateUpdateNewsCategoryByIdParamsTypes,
) => {
  const res = await axiosInstance.put(`news-categories/${id}`, params);
  return res.data.data;
};

export const createNewsCategoryByIdService = async (
  params: CreateUpdateNewsCategoryByIdParamsTypes
) => {
  const res = await axiosInstance.post('news-categories', params);
  return res.data.data;
};

export const deleteNewsCategoryService = async (params: { ids: number[] }) => {
  const res = await axiosInstance.delete('news-categories', { data: params });
  return res.data;
};
export const deleteNewsCategoryTranslationService = async (params: { ids: number[] }) => {
  const res = await axiosInstance.delete('news-categories/translations', { data: params });
  return res.data;
};

export const updateNewsCategoryStatusService = async (
  id: number,
  status: number
): Promise<void> => {
  await axiosInstance.put(`news-categories/${id}/update-status`, { status });
};

export const changeStatusNewsCategoryManyIdService = async (ids: number[], status: number)
  : Promise<void> => {
  await axiosInstance.put('news-categories/update-status-with-many-id', { status, ids });
};

export const getNewsCategoryCommentService = async (params: GetNewsCategoryCommentParams)
  : Promise<APIPaginationResponse<NewsCategoryCommentType[]>> => {
  const res = await axiosInstance.get('news-category-comments', { params });
  return res.data;
};
export const createNewsCategoryCommentService = async (params: CreateNewsCategoryCommentParams)
  : Promise<CreateNewsCategoryCommentType> => {
  const res = await axiosInstance.post('news-category-comments', params);
  return res.data;
};
