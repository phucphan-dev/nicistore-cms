import axiosInstance from '../common/instance';

import {
  ContactDataType,
  ContactProblemCommentType,
  ContactProblemDataType,
  CreateContactProblemCommentParams,
  CreateContactProblemCommentType,
  CreateContactProblemParams,
  DeleteContactParams,
  DeleteContactProblemParams,
  DeleteContactProblemTranslationParams,
  GetAllContactParams,
  GetAllContactProblemParams,
  GetContactParams,
  GetContactProblemCommentParams,
  GetContactProblemParams,
  UpdateStatusContactParams,
  UpdateContactProblemParams
} from './types';

/* CONTACT */
export const getAllContactService = async (
  params?: GetAllContactParams
): Promise<APIPaginationResponse<ContactDataType[]>> => {
  const res = await axiosInstance.get('contacts', { params });
  return res.data;
};

export const getContactService = async (
  params: GetContactParams,
): Promise<ContactDataType> => {
  const res = await axiosInstance.get('contacts', { params });
  return res.data.data;
};

export const updateStatusContactService = async (params: UpdateStatusContactParams)
  : Promise<void> => {
  const { id, ...rest } = params;
  await axiosInstance.put(`contacts/${id}/update-status`, { ...rest });
};

export const changeStatusContactManyIdService = async (ids: number[], status: number)
  : Promise<void> => {
  await axiosInstance.put('contacts/update-status-with-many-id', { status, ids });
};

export const deleteContactService = async (
  params: DeleteContactParams,
): Promise<void> => {
  await axiosInstance.delete('contacts', { data: params });
};

/* CONTACT PROBLEM */
export const getAllContactProblemService = async (
  params?: GetAllContactProblemParams
): Promise<APIPaginationResponse<ContactProblemDataType[]>> => {
  const res = await axiosInstance.get('contact-problems', { params });
  return res.data;
};

export const getContactProblemService = async (
  params: GetContactProblemParams,
): Promise<ContactProblemDataType> => {
  const { id, ...rest } = params;
  const res = await axiosInstance.get(`contact-problems/${id}`, { params: rest });
  return res.data.data;
};

export const createContactProblemService = async (params: CreateContactProblemParams)
  : Promise<{ id: number }> => {
  const res = await axiosInstance.post('contact-problems', params);
  return res.data.data;
};

export const updateContactProblemService = async (
  params: UpdateContactProblemParams
)
  : Promise<unknown> => {
  const { id, ...rest } = params;
  const res = await axiosInstance.put(`contact-problems/${id}`, { ...rest });
  return res.data;
};

export const updateStatusContactProblemService = async (id: number, status: number)
  : Promise<void> => {
  await axiosInstance.put(`contact-problems/${id}/update-status`, { status });
};

export const changeStatusContactProblemManyIdService = async (ids: number[], status: number)
  : Promise<void> => {
  await axiosInstance.put('contact-problems/update-status-with-many-id', { status, ids });
};

export const deleteContactProblemService = async (params: DeleteContactProblemParams)
  : Promise<void> => {
  await axiosInstance.delete('contact-problems', { data: params });
};

export const deleteContactProblemTranslationService = async (
  params: DeleteContactProblemTranslationParams,
): Promise<void> => {
  await axiosInstance.delete('contact-problems/translations', { data: params });
};

export const getContactProblemCommentService = async (params: GetContactProblemCommentParams)
  : Promise<APIPaginationResponse<ContactProblemCommentType[]>> => {
  const res = await axiosInstance.get('contact-problem-comments', { params });
  return res.data;
};

export const createContactProblemCommentService = async (params: CreateContactProblemCommentParams)
  : Promise<CreateContactProblemCommentType> => {
  const res = await axiosInstance.post('contact-problem-comments', params);
  return res.data;
};
