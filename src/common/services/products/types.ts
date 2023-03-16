/* Categories */
export type ProductCategoryItemTypes = {
  categoryData: {
    id: number;
    parentId?: number;
    status: number;
    createdAt: string;
    updatedAt: string;
  };
  translations: {
    [language: string]: {
      id: number;
      name: string;
      slug: string;
    }
  };
  seoData?: SeoDataTypes;
};

export type CreateUpdateProductCategoryTypes = {
  parent_id?: number;
  status?: number;
  display_order?: number;
  translations?: {
    [key: string]: {
      categoryData: {
        name: string;
        slug: string;
      }
    }
  };
  seoData?: SeoDataTypes;
};

/* Colors */

export type ProductColorItemTypes = {
  id: number;
  displayOrder: number;
  code: string;
  name: string;
  status: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateUpdateProductColorTypes = {
  status: number;
  display_order: number;
  code: string;
  name: string;
};

/* Sizes */

export type ProductSizeItemTypes = {
  id: number;
  displayOrder: number;
  code: string;
  name: string;
  status: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateUpdateProductSizeTypes = {
  status: number;
  display_order: number;
  code: string;
  name: string;
};
