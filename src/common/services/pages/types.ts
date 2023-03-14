export type TemplateManageType = {
  id: number;
  code: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export type TemplatePageType = {
  blocks: BlocksType;
} & TemplateManageType;

export type UpdateTemplateManageType = {
  id: number;
  name: string;
  image?: string;
};

export type PageTranslationType = {
  [lang: string]: {
    id: number;
    title: string;
    slug: string;
    description?: string;
  };
};

export type PageDataItemType = {
  pageData: {
    id: number;
    isHome: boolean;
    status: number;
    createdAt: string;
    updatedAt: string;
  };
  template: {
    name: string;
  };
  translations: PageTranslationType;
};

export type PageDetailType = {
  pageData: {
    id: number;
    isHome: boolean;
    parentId?: number;
    status: number;
    createdAt: string;
    updatedAt: string;
  };
  blocks: BlocksType;
  template: {
    id: number;
    name: string;
    code: string;
  };
  translations?: PageTranslationType;
  seoData?: SeoDataTypes;
  ogData?: OgDataTypes;
  creator: CreatorType;
  updater: CreatorType;
};

export type CreatePageParams = {
  templateCode?: string;
  parentId?: number | null;
  status?: number;
  isHome?: boolean;
  translations: {
    [key: string]: {
      pageData: {
        title: string;
        slug: string;
      },
      blocks: any;
    }
  };
  seoData?: SeoDataTypes;
  ogData?: OgDataTypes;
};

export type PreviewPageReponse = {
  link: string;
};

export type PageCommentDataType = {
  id: number;
  page: {
    id: number;
    title: string;
    slug: string;
  }
  comment: string;
  createdAt: string;
  updatedAt: string;
};

export type PageCommentType = {
  pageCommentData: PageCommentDataType
  creator: CreatorType;
  updater: CreatorType;
};

export type GetPageCommentParams = {
  pageId?: number;
  locale?: string;
  keyword?: string;
  limit?: number;
  page?: number;
};

export type CreatePageCommentParams = {
  pageId: number;
  comment: string;
};

export type CreatePageCommentType = {
  id: number;
};
