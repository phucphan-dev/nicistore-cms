export type Params = {
  name: string;
  parentId: number | null;
};

export type ParamsIds = {
  ids: number[];
};

export type ParamsId = {
  id?: number;
};

export type MediaFolderType = {
  id: number;
  parentId: number | null;
  type: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  path?: string;
  extension?: string;
  mimeType?: string;
  thumbnail?: string;
  size?: number;
  width?: number | null;
  height?: number | null;
  imageAdvanced?: string | null;
  options?: {
    title?: string;
    alt?: string;
  }
};

export type MediaFolderDataType = {
  id: number;
  parent: string;
  parentId: number | null;
  name: string;
  path: string;
  isDirectory: boolean;
  type: string;
  date: string;
  size: number;
  thumbnail?: string;
};

export type UpdateInfoFileParams = {
  id: number;
  title?: string;
  alt?: string;
};
