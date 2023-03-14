/* NEWS */
export type NewsTranslation = {
  [key: string]: {
    id: number;
    newsId: number;
    locale: string;
    slug: string;
    title: string;
    description: string;
    content: string;
    thumbnail: {
      alt: string;
      path: string;
      title: string;
    };
    tags: string[];
  }
};

export type NewsDataTypes = {
  id: number;
  isPopular: boolean;
  publishedAt: string;
  status: number;
};

export type GetAllNewsServiceTypes = {
  newsData: NewsDataTypes;
  categories: number[];
  translations: NewsTranslation;
};

export type GetNewsByIdParamsTypes = {
  id: number;
  locale: string;
};

export type NewsTranslationTypes = {
  [key: string]: {
    id: number;
    newsId: number;
    locale: string;
    slug: string;
    title: string;
    description: string;
    content: string;
    thumbnail: Thumbnail;
    tags: string[];
  }
};

export type NewsByIdDataTypes = {
  newsData: {
    id: number;
    displayOrder: number;
    isPopular: boolean;
    visitedCount: number;
    status: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  categories: {
    id: number;
    name: string;
  }[];
  relatedNews: any[];
  translations: NewsTranslationTypes;
  seoData: SeoDataTypes;
  ogData: OgDataTypes;
  creator: CreatorType;
  updater: CreatorType;
};

export type CreateUpdateNewsParamsTypes = {
  status?: number;
  displayOrder?: number;
  isPopular?: boolean;
  publishedAt?: string;
  relatedIds?: number[];
  categoryIds?: number[];
  translations?: {
    [keyword: string]: {
      newsData?: {
        title: string;
        slug: string;
        description?: string;
        content: string;
        thumbnail?: Thumbnail;
      };
      tags?: string[];
    }
  };
  seoData?: SeoDataTypes;
  ogData?: OgDataTypes;
};

export type DeleteNewsParamsTypes = {
  ids: number[];
};

export type NewsCommentDataType = {
  id: number;
  news: {
    id: number;
    title: string;
    slug: string;
  }
  comment: string;
  createdAt: string;
  updatedAt: string;
};

export type NewsCommentType = {
  newsCommentData: NewsCommentDataType
  creator: CreatorType;
  updater: CreatorType;
};

export type GetNewsCommentParams = {
  newsId?: number;
  locale?: string;
  keyword?: string;
  limit?: number;
  page?: number;
};

export type CreateNewsCommentParams = {
  newsId: number;
  comment: string;
};

export type CreateNewsCommentType = {
  id: number;
};

/* NEWS-CATEGORY */
export type NewsCategoryTranslation = {
  [key: string]: {
    id: number;
    name: string;
    slug: string;
    description: string;
    newsCategoryId: number;
    locale: string;
  }
};

export type GetAllNewsCategoryTypes = {
  newsCategoryData: {
    id: number;
    createdAt: string;
    updatedAt: string;
    status: number;
    creator: CreatorType;
    updater: CreatorType;
  };
  parentCategory: string;
  translations: NewsCategoryTranslation;
};

export type NewsCategoryByIdParams = {
  id: number;
  locale: string;
};

export type GetNewsCategoryByIdTypes = {
  newsCategoryData: {
    id: number;
    createdAt: string;
    updatedAt: string;
    displayOrder: number;
    status: number;
  };
  parentCategory: string;
  translations: NewsCategoryTranslation;
  seoData?: SeoDataTypes;
  ogData?: OgDataTypes;
  creator: CreatorType;
  updater: CreatorType;
};

export type CreateUpdateNewsCategoryByIdParamsTypes = {
  parentId?: number;
  status?: number;
  displayOrder?: number;
  translations?: {
    [key: string]: {
      newsCategoryData: {
        name: string;
        slug: string;
        description: string;
      }
    }
  };
  seoData?: SeoDataTypes;
  ogData?: OgDataTypes;
};

export type PreviewNewsReponse = {
  link: string;
};

export type NewsCategoryCommentDataType = {
  id: number;
  newsCategory: {
    id: number;
    title: string;
    slug: string;
  }
  comment: string;
  createdAt: string;
  updatedAt: string;
};

export type NewsCategoryCommentType = {
  newsCategoryCommentData: NewsCategoryCommentDataType
  creator: CreatorType;
  updater: CreatorType;
};

export type GetNewsCategoryCommentParams = {
  newsCategoryId?: number;
  locale?: string;
  keyword?: string;
  limit?: number;
  page?: number;
};

export type CreateNewsCategoryCommentParams = {
  newsCategoryId: number;
  comment: string;
};

export type CreateNewsCategoryCommentType = {
  id: number;
};
