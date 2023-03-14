export type TranslationsTypes = {
  id: number;
  group: string;
  key: string;
  text: {
    en?: string;
    vi?: string;
  };
};

export type GetTranslationsParamsTypes = {
  keyword?: string;
  group?: string;
  limit?: number;
  page?: number;
};

export type UpdateTranslationsParamsTypes = {
  id?: number;
  vi?: string;
  en?: string;
};
