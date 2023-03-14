export type FormFieldItemType = {
  value: string;
  text: string;
};

export type FormManagementDataType = {
  id: number;
  code: string;
  name: string;
  htmlId: string;
  htmlClass: string;
  createdAt: string;
  updatedAt: string;
  updater: CreatorType;
  creator: CreatorType;
};

export type FormManagementDetailType = {
  id: number;
  code: string;
  name: string;
  htmlId: string;
  htmlClass: string;
  buttons: {
    [type: string]: {
      htmlId: string;
      htmlClass: string;
      text: {
        [lang: string]: string;
      }
    }
  };
  fields?: any[];
  createdAt: string;
  updatedAt: string;
  updater: CreatorType;
  creator: CreatorType;
};

export type GetAllFormManagementParams = {
  keyword?: string;
  limit?: number;
  page?: number;
};

export type GetFormManagementParams = {
  id: number;
};

export type CreateFormManagementParams = {
  name: string;
  htmlId: string;
  htmlClass: string;
  buttons: {
    [type: string]: {
      htmlId: string;
      htmlClass: string;
      text: {
        [lang: string]: string;
      }
    }
  };
  fields?: any[];
};

export type UpdateFormManagementParams = {
  id: number;
} & CreateFormManagementParams;

export type DeleteFormManagementParams = {
  ids: number[];
};
