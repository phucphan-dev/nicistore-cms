export type GetAllFaqsParamsTypes = {
  keyword?: string;
  group?: string;
  limit?: number;
  page?: number;
};

export type FaqTypes = {
  faqData: {
    id: number
    status: number
    displayOrder: number
    faqCategories: any[]
    createdAt: string
    updatedAt: string
    updater: {
      email: string
      name: string
    }
    creator: {
      email: string
      name: string
    }
  }
  translations: {
    [key: string]: {
      question: string
      answer: string
    },
  }
};

export type FaqDetailTypes = {
  faqData: {
    id: number
    status: number;
    displayOrder: number
    createdAt: string
    updatedAt: string
  },
  faqCategories: {
    [language: string]: {
      id: number;
      name: string;
    }
  }[],
  translations: {
    [key: string]: {
      question: string
      answer: string
    },
  }
  creator: CreatorType;
  updater: CreatorType;
};

export type GetFaqByIdParamsTypes = {
  id: number;
  locale: string;
};

export type CreateFaqParamsTypes = {
  faqCategoryId?: Array<number>;
  displayOrder?: number;
  translations?: {
    [keyword: string]: {
      faqData?: {
        question: string
        answer: string
      }
    }
  };
  seoData?: SeoDataTypes;
  ogData?: OgDataTypes;
};

export type FaqCommentData = {
  id: number;
  faq: {
    id: number;
    title?: string;
    slug: string;
  }
  comment: string;
  createdAt: string;
  updatedAt: string;
};

export type FaqCommentType = {
  faqCommentData: FaqCommentData;
  creator: CreatorType;
  updater: CreatorType;
};

export type GetFaqCommentParams = {
  faqId?: number;
  locale?: string;
  keyword?: string;
  limit?: number;
  page?: number;
};

export type CreateFaqCommentParams = {
  faqId: number;
  comment: string;
};

export type CreateFaqCommentType = {
  id: number;
};

/* FAQ-CATEGORY */
export type GetFaqCategoryByIdParamsTypes = {
  id: number;
  locale: string;
};

export type CreateFaqCategoriesParamsTypes = {
  parentId?: number;
  displayOrder?: number;
  status?: number;
  translations?: {
    [keyword: string]: {
      faqCategoryData?: {
        name?: string;
        slug?: string;
        description?: string;
      }
    }
  };
  seoData?: SeoDataTypes;
  ogData?: OgDataTypes;
};

export interface FaqCategoryTypes {
  updater: {
    email: string;
    name: string;
    avatar: any;
    bgAvatar: any;
  }
  creator: {
    email: string;
    name: string;
    avatar: any;
    bgAvatar: any;
  },
  faqCategoryData: {
    id: number
    status: number
    displayOrder: number
    parentId: any
    createdAt: string
    updatedAt: string
  }
  translations: {
    [key: string]: {
      name: string;
      slug: string;
      description: string;
      id: number;
    },
  },
  seo: SeoDataTypes;
  og: OgDataTypes;
}

export interface FaqCategoryDetailTypes {
  faqCategoryData: {
    id: number
    status: number;
    displayOrder: number
    parentId: any
    createdAt: string
    updatedAt: string
  }
  translations: {
    [key: string]: {
      name: string
      slug: string
      description: string
    },
  },
  faqCategories: {
    [key: string]: {
      id: number
      name: string
    },
  },
  seoData: SeoDataTypes;
  ogData: OgDataTypes;
  creator: CreatorType;
  updater: CreatorType;
}

export type FaqCategoryCommentData = {
  id: number;
  faqCategory: {
    id: number;
    title?: string;
    slug: string;
  }
  comment: string;
  createdAt: string;
  updatedAt: string;
};

export type FaqCategoryCommentType = {
  faqCategoryCommentData: FaqCategoryCommentData;
  creator: CreatorType;
  updater: CreatorType;
};

export type GetFaqCategoryCommentParams = {
  faqCategoryId?: number;
  locale?: string;
  keyword?: string;
  limit?: number;
  page?: number;
};

export type CreateFaqCategoryCommentParams = {
  faqCategoryId: number;
  comment: string;
};

export type CreateFaqCategoryCommentType = {
  id: number;
};
