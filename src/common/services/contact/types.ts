/* CONTACT */
export type ContactData = {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  content: string
  status: number
  createdAt: string
  updatedAt: string
  updater?: string
  creator?: string
};

export type ProblemData = {
  id: number
  status: {
    name: string;
    value: number;
  }
  displayOrder: string
  createdAt: string
  updatedAt: string
  createdBy: number
  updatedBy: number
  contactProblemId: number
  locale: string
  name: string
  translations: ProblemTranslation[]
};

export type ProblemTranslation = {
  locale: string
  name: string
  contactProblemId: number
};

export type ContactDataType = {
  contactData: ContactData
  problem: ProblemData
};

export type GetAllContactParams = {
  locale?: string;
  keyword?: string;
  limit?: number;
  page?: number;
};

export type GetContactParams = {
  id: number;
};

export type UpdateStatusContactParams = {
  id: number;
  status: number;
};

export type DeleteContactParams = {
  ids: number[];
};

/* CONTACT PROBLEM */
export type GetAllContactProblemParams = {
  locale?: string;
  keyword?: string;
  limit?: number;
  page?: number;
};

export type GetContactProblemParams = {
  id: number;
  locale?: string;
};

export type CreateContactProblemParams = {
  displayOrder?: string;
  translations?: {
    [keyword: string]: {
      contactProblemData?: {
        name?: string;
      }
    }
  };
};

export type UpdateContactProblemParams = {
  id: number;
} & CreateContactProblemParams;

export type DeleteContactProblemParams = {
  ids: number[];
};

export type DeleteContactProblemTranslationParams = {
  ids: number[];
};

export type ContactProblemData = {
  id: number
  status: number
  displayOrder: string
  createdAt: string
  updatedAt: string
};

export type ContactProblemDataType = {
  contactProblemData: ContactProblemData
  translations: {
    [lang: string]: {
      id: number
      name: string
    },
  }
  creator: CreatorType;
  updater: CreatorType;
};

export type ContactProblemCommentData = {
  id: number;
  contactProblem: {
    id: number;
    title?: string;
    slug: string;
  }
  comment: string;
  createdAt: string;
  updatedAt: string;
};

export type ContactProblemCommentType = {
  contactProblemCommentData: ContactProblemCommentData;
  creator: CreatorType;
  updater: CreatorType;
};

export type GetContactProblemCommentParams = {
  contactProblemId?: number;
  locale?: string;
  keyword?: string;
  limit?: number;
  page?: number;
};

export type CreateContactProblemCommentParams = {
  contactProblemId: number;
  comment: string;
};

export type CreateContactProblemCommentType = {
  id: number;
};
