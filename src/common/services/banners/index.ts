import axiosInstance from '../common/instance';

import {
  BannerCommentType,
  CreateBannerCommentParams,
  CreateBannerCommentType,
  CreateBannerParamsTypes, DeleteMultipleBannerParamsTypes,
  GetAllBannersTypes, GetBannerByIdTypes, GetBannerCommentParams
} from './types';

const getAllBannersService = async (
  params?: BaseFilterParams
): Promise<APIPaginationResponse<GetAllBannersTypes[]>> => {
  const res = await axiosInstance.get('banners', { params });
  return res.data;
};

export const createBannerService = async (params: CreateBannerParamsTypes) => {
  const res = await axiosInstance.post('banners', params);
  return res.data;
};

export const updateBannerService = async (id: number, params: CreateBannerParamsTypes) => {
  const res = await axiosInstance.put(`banners/${id}`, params);
  return res.data;
};

export const getBannerByIdService = async (params: number): Promise<GetBannerByIdTypes> => {
  const res = await axiosInstance.get(`banners/${params}`);
  return res.data.data;
};

export const deleteMultipleBannerByIdService = async (
  params: DeleteMultipleBannerParamsTypes
) => axiosInstance.delete('banners', { params });

export default getAllBannersService;

export const getBannerCommentService = async (params: GetBannerCommentParams)
  : Promise<APIPaginationResponse<BannerCommentType[]>> => {
  const res = await axiosInstance.get('banner-comments', { params });
  return res.data;
};
export const createBannerCommentService = async (params: CreateBannerCommentParams)
  : Promise<CreateBannerCommentType> => {
  const res = await axiosInstance.post('banner-comments', params);
  return res.data;
};
