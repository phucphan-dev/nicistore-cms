export type RedirectDataType = {
  id: number;
  from: string;
  to: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GetAllRedirectsParams = {
  limit?: number;
  page?: number;
};

export type GetRedirectParams = {
  id: number;
};

export type CreateRedirectParams = {
  from: string;
  to: string;
};

export type UpdateRedirectParams = {
  id: number;
  from: string;
  to: string;
};

export type DeleteRedirectParams = {
  ids: number[];
};

export type PreviewImportRedirectParams = {
  file: File;
};

export type PreviewImportDataType = {
  from: string;
  to: string;
  errors: any[];
};

export type ImportRedirectParams = {
  file: File;
};
