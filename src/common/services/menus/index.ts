import axiosInstance from '../common/instance';

import {
  CreateUpdateMenuParamsTypes,
  DeleteMenuParamsTypes,
  MenuByCodeParamsTypes, MenuByCodeTypes, MenuItemTypes, MenusParamsTypes,
  ReferenceDataTypes, UpdateMenuItemParamsTypes
} from './types';

export const postMenusService = async (params: MenusParamsTypes): Promise<void> => {
  const res = await axiosInstance.post('menus', params);
  return res.data;
};

export const getMenusService = async (
  params?: BaseFilterParams
): Promise<APIPaginationResponse<MenuItemTypes[]>> => {
  const res = await axiosInstance.get('menus', { params });
  return res.data;
};
export const getMenusByCodeService = async (
  params: MenuByCodeParamsTypes
): Promise<MenuByCodeTypes> => {
  const res = await axiosInstance.get(`menus/${params.code}?locale=${params.locale}`);
  return res.data.data;
};

export const updateMenuItemService = async (id: number, params: UpdateMenuItemParamsTypes) => {
  const res = await axiosInstance.put(`menus/menu-items/${id}`, params);
  return res.data;
};

export const createUpdateMenuService = async (params: CreateUpdateMenuParamsTypes) => {
  const res = await axiosInstance.post('menus', params);
  return res.data;
};

export const getReferenceTypesService = async (): Promise<ReferenceDataTypes> => {
  const res = await axiosInstance.get('menus/get-reference-types');
  return res.data.data;
};

export const deleteMenuService = async (params: DeleteMenuParamsTypes) => axiosInstance.delete('menus', { params });
