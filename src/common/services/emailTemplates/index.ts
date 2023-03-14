import axiosInstance from '../common/instance';

import {
  EmailTemplatesDetailData,
  EmailTemplatesListData,
  GetAllEmailTemplatesParams,
  GetEmailTemplateParams,
  UpdateEmailTemplateParams,

} from './types';

export const getAllEmailTemplatesService = async (params?: GetAllEmailTemplatesParams)
  : Promise<APIPaginationResponse<EmailTemplatesListData[]>> => {
  const res = await axiosInstance.get('email-templates', { params });
  return res.data;
};

export const getEmailTemplateService = async (params: GetEmailTemplateParams)
  : Promise<EmailTemplatesDetailData> => {
  const { id, ...rest } = params;
  const res = await axiosInstance.get(`email-templates/${id}`, { params: rest });
  return res.data;
};

export const updateEmailTemplateService = async (
  params: UpdateEmailTemplateParams,
): Promise<void> => {
  const { id, ...rest } = params;
  await axiosInstance.put(`email-templates/${id}`, { ...rest });
};
