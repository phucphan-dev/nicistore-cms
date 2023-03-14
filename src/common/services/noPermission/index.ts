import axiosInstance from '../common/instance';

import {
  AdvancedFilterTypes, DropdownCodeParamsTypes, DropdownDataType
} from './types';

const getDropdownCodeDataService = async (
  params: DropdownCodeParamsTypes
): Promise<APIPaginationResponse<DropdownDataType[]>> => {
  const res = await axiosInstance.get(`no-permission/dropdown/${params.type}`, { params: { ...params.filter, locale: params.locale } });
  return res.data;
};

export const getDropdownTypesService = async (): Promise<string[]> => {
  const res = await axiosInstance.get('no-permission/dropdown-types');
  return res.data.data;
};

export const getAdvancedFilterService = async (): Promise<AdvancedFilterTypes> => {
  const res = await axiosInstance.get('no-permission/advanced-filters');
  return res.data.data;
};

export default getDropdownCodeDataService;
