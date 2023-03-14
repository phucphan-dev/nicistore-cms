import axiosInstance from '../common/instance';

import {
  MediaFolderType,
  Params,
  ParamsIds,
  ParamsId,
  UpdateInfoFileParams,
} from './types';

export const getFolderDataService = async (): Promise<MediaFolderType[]> => {
  const res = await axiosInstance.get('media-folders/all-folders');
  return res.data.data;
};

export const createFolderService = async (
  params: Params,
): Promise<MediaFolderType> => {
  const res = await axiosInstance.post('media-folders', params);
  return res.data.data;
};

export const deleteFoldersService = async (
  params: ParamsIds,
): Promise<void> => {
  const res = await axiosInstance.delete('media-folders', { data: params });
  return res.data;
};

export const getItemByFolder = async (
  params?: ParamsId,
): Promise<MediaFolderType[]> => {
  const res = await axiosInstance.get('media-folders/get-items-by-folder', { params });
  return res.data.data;
};

export const renameFoldersService = async (
  id: number,
  params: Params,
): Promise<void> => {
  const res = await axiosInstance.put(`media-folders/${id}`, params);
  return res.data;
};

export const deleteFilesService = async (params: ParamsIds) => {
  const res = await axiosInstance.delete('media-files', { data: params });
  return res.data;
};

export const getMediaInTrashService = async (): Promise<MediaFolderType[]> => {
  const res = await axiosInstance.get('media-trash');
  return res.data.data;
};

export const forceDeleteMediaInTrashService = async (params: ParamsIds): Promise<void> => {
  const res = await axiosInstance.delete('media-trash/force-delete', { data: params });
  return res.data;
};

export const restoreMediaInTrashService = async (params: ParamsIds): Promise<void> => {
  const res = await axiosInstance.post('media-trash/restore', params);
  return res.data;
};

export const emptyMediaInTrashService = async (): Promise<void> => {
  const res = await axiosInstance.delete('media-trash/empty');
  return res.data;
};

export const updateInfoFileService = async (params: UpdateInfoFileParams): Promise<void> => {
  await axiosInstance.put(`media-files/${params.id}/image`, { title: params.title, alt: params.alt });
};
