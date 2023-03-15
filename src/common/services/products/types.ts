export type ProductCategoryItemTypes = {
  categoryData: {
    id: number;
    parentId: number | null;
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
  }
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
