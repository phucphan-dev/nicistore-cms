import axiosInstance from '../common/instance';

const getDropdownTypeService = async <T>(type: string,
  params?: BaseFilterParams): Promise<APIPaginationResponse<[T]>> => {
  const res = await axiosInstance.get(`no-permission/dropdown/${type}`, { params });
  return res.data;
};

export default getDropdownTypeService;
