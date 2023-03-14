/* eslint-disable import/no-cycle */
import { TreeDataNode } from 'antd';

import { OCFinderData } from './OCFinder/OCFInderItem';

import {
  getFolderDataService,
  createFolderService,
  deleteFoldersService,
  renameFoldersService,
  getItemByFolder,
  deleteFilesService,
  getMediaInTrashService,
  emptyMediaInTrashService,
  restoreMediaInTrashService,
  forceDeleteMediaInTrashService,
} from 'common/services/mediaFolder';
import {
  MediaFolderType,
  MediaFolderDataType,
  Params,
  ParamsIds,
} from 'common/services/mediaFolder/types';
import { getImageURL } from 'common/utils/functions';

export const videoRegex = /video\/*/;
export const imageRegex = /image\/png|image\/jpeg|imagesvg\+xml|image\/gif|image\/svg\+xml/;
const mediaRegex = /video\/mp4|image\/png|image\/jpeg|imagesvg\+xml|image\/gif|image\/svg\+xml/;

const convertThumbnail = (item: MediaFolderType) => {
  if (item.path && mediaRegex.test(item?.mimeType || '')) {
    return getImageURL(`${item.path}/${item.name}.${item.extension}`);
  }
  return '';
};

const services = {

  async getFolderData(): Promise<MediaFolderType[]> {
    const res = await getFolderDataService();
    return res;
  },

  async getItemByFolderData(id?: number): Promise<MediaFolderType[]> {
    const res = await getItemByFolder({
      id,
    });
    return res;
  },

  async createFolderData(
    params: Params,
  ): Promise<MediaFolderType> {
    const res = await createFolderService(params);
    return res;
  },

  async deleteFoldersList(
    params: ParamsIds,
  ): Promise<void> {
    await deleteFoldersService(params);
  },

  async deleteFilesList(
    params: ParamsIds,
  ): Promise<void> {
    await deleteFilesService(params);
  },

  async renameFolders(
    id: number,
    params: Params,
  ): Promise<void> {
    await renameFoldersService(id, params);
  },

  /* Trash */
  async getMediaTrash(): Promise<MediaFolderType[]> {
    const res = await getMediaInTrashService();
    return res;
  },

  async emptyTrash(): Promise<void> {
    await emptyMediaInTrashService();
  },

  async restoreTrash(ids: number[]): Promise<void> {
    await restoreMediaInTrashService({ ids });
  },

  async forceDeleteFilesList(
    params: ParamsIds,
  ): Promise<void> {
    await forceDeleteMediaInTrashService(params);
  },
  /* Trash */

  convertFolderData(data: MediaFolderType[], target?: string) {
    const filterData = (parentId: number) => target || `/${data.find((item) => item.id === parentId)?.name}`;
    if (data.length > 0) {
      return data.map((el) => ({
        id: el.id,
        parentId: el.parentId,
        parent: el.parentId === null ? '' : `${filterData(el.parentId)}`,
        name: el.name,
        path: el.type === 'd' ? el?.path
          || (el.parentId === null
            ? `/${el.name}`
            : `${filterData(el.parentId)}/${el.name}`
          ) : convertThumbnail(el),
        isDirectory: el.type === 'd',
        type: el.type === 'd' ? 'inode/directory' : (el?.mimeType || ''),
        date: el.updatedAt,
        size: el?.size || 0,
        thumbnail: el.thumbnail,
        title: el.options?.title,
        alt: el.options?.alt
      }));
    }
    return [];
  },

  getTree(data: MediaFolderDataType[]): Array<TreeDataNode> {
    const map: Record<string | number, TreeDataNode> = {};
    const result: Array<TreeDataNode> = [];

    data
      .filter((d: MediaFolderDataType) => d.isDirectory)
      .forEach((d: MediaFolderDataType) => {
        const item = { key: d.id, title: d.name, path: d.path };
        if (d.parentId === null) {
          result.push(item);
        } else {
          map[d.parentId].children ??= [];
          map[d.parentId].children?.push(item);
        }

        map[item.key] = item;
      });

    return result;
  },

  getContent(
    targetId: number,
    data: MediaFolderDataType[],
    dataTree: MediaFolderDataType[]
  ): {
    path: Array<OCFinderData>, content: Array<OCFinderData>
  } {
    const treePathMap = Object.fromEntries(dataTree
      .filter(({ isDirectory }) => isDirectory)
      .map(({
        id,
        name,
        parent,
        parentId,
      }: any) => [id, {
        id,
        name,
        parent,
        parentId,
      }]));

    const path = [];
    let cId = targetId;
    while (cId && treePathMap[cId]) {
      const item = treePathMap[cId];
      path.unshift(item);

      cId = item.parentId;
    }
    const dataFilter = targetId && targetId !== -1 ? data
      .filter((d) => d.parentId === targetId) : data;
    return {
      content: dataFilter.map(({
        id, name, isDirectory,
        type, size, date, thumbnail, isCreate, parentId, title, alt, path: filePath
      }: any) => ({
        id,
        name,
        isDirectory,
        type,
        size,
        date: new Date(date),
        thumbnail,
        path: filePath,
        isCreate,
        parentId,
        title,
        alt
      })),
      path,
    };
  },

  search(keyword: string, data: any): Array<OCFinderData> {
    const w = keyword.toLowerCase();

    return data.filter(((d: any) => d.name.toLowerCase().indexOf(w) >= 0))
      .map(({
        id, name, isDirectory, type, size, date, thumbnail, isCreate, title, alt
      }: any) => ({
        id, name, isDirectory, type, size, date: new Date(date), thumbnail, isCreate, title, alt
      }));
  },
};

export default services;
