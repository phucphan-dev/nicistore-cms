import axiosInstance from '../common/instance';

import {
  CreatePageCommentParams,
  CreatePageCommentType,
  CreatePageParams,
  GetPageCommentParams,
  PageCommentType,
  PageDataItemType,
  PageDetailType,
  PreviewPageReponse,
  TemplateManageType,
  TemplatePageType,
  UpdateTemplateManageType,
} from './types';
/* Page Templates */

export const getAllTemplatePagesService = async (): Promise<TemplatePageType[]> => {
  const res = await axiosInstance.get('pages/templates');
  return res.data.data;
};

export const getAllTemplateManageService = async (
  params?: BaseFilterParams
): Promise<APIPaginationResponse<TemplateManageType[]>> => {
  const res = await axiosInstance.get('page-templates', { params });
  return res.data;
};

export const updateTemplateManageService = async (
  params: UpdateTemplateManageType
): Promise<void> => {
  await axiosInstance.put(
    `page-templates/${params.id}`,
    { name: params.name, image: params.image }
  );
};

export const getPageTemplateByIdService = async (id: number): Promise<TemplatePageType> => {
  const res = await axiosInstance.get(`page-templates/${id}`);
  return res.data.data;
};

/* Page Templates */

/* Pages */

export const getAllPagesService = async (
  params?: BaseFilterParams
): Promise<APIPaginationResponse<PageDataItemType[]>> => {
  const res = await axiosInstance.get('pages', { params });
  return res.data;
};

export const getDetailPagesService = async (id: number, locale: string)
  : Promise<PageDetailType> => {
  const res = await axiosInstance.get(`pages/${id}?locale=${locale}`);
  return res.data.data;
};

export const deletePagesService = async (
  ids: number[]
): Promise<void> => {
  await axiosInstance.delete('pages', { data: { ids } });
};

export const updatePagesService = async (id: number, params: CreatePageParams): Promise<void> => {
  await axiosInstance.put(`pages/${id}`, params);
};

export const createPagesService = async (params: CreatePageParams): Promise<{ id: number }> => {
  const response = await axiosInstance.post('pages', params);
  return response.data.data;
};

export const previewPagesService = async (
  params: CreatePageParams
): Promise<PreviewPageReponse> => {
  const response = await axiosInstance.post('pages/preview', params);
  return response.data.data;
};

export const changeStatusPagesService = async (id: number, status: number): Promise<void> => {
  await axiosInstance.put(`pages/${id}/update-status`, { status });
};

export const changeStatusManyIdService = async (ids: number[], status: number): Promise<void> => {
  await axiosInstance.put('pages/update-status-with-many-id', { status, ids });
};

export const deletePageTranslationService = async (
  ids: number[]
): Promise<void> => {
  await axiosInstance.delete('pages/translations', { data: { ids } });
};

export const getPageCommentService = async (params: GetPageCommentParams)
  : Promise<APIPaginationResponse<PageCommentType[]>> => {
  const res = await axiosInstance.get('page-comments', { params });
  return res.data;
};
export const createPageCommentService = async (params: CreatePageCommentParams)
  : Promise<CreatePageCommentType> => {
  const res = await axiosInstance.post('page-comments', params);
  return res.data;
};

/* Pages */
