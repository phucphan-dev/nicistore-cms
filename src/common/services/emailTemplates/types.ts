export type GetAllEmailTemplatesParams = {
  keyword?: string;
  limit?: number;
  page?: number;
};

export type EmailTemplatesListData = {
  id: number
  code: string
  name: string
  subject: string
  createdAt: string
  updatedAt: string
  updater?: CreatorType
  creator?: CreatorType
};

export type GetEmailTemplateParams = {
  id: number;
  locale?: string;
};

export type EmailTemplatesDetailData = {
  data: {
    id: number
    code: string
    name: string
    subject: string
    content: string
    createdAt: string
    updatedAt: string
  }
  markdown: string;
  updater?: CreatorType
  creator?: CreatorType
};

export type UpdateEmailTemplateParams = {
  id: number;
  name: string
  subject: string
  content: string
};
