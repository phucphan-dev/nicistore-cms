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

/* Products */
export type ProductItemTypes = {
  productData: {
    id: number;
    status: number;
    display_order: number;
    sku?: string;
    totalInit: number;
    stock: number;
    thumbnail: string;
    galleries: string[];
    price: number;
    priceInit: number;
    sale_percent: number;
    createdAt: string;
    updatedAt: string;
  };
  categories: {
    id: number;
    name: string;
    slug: string;
  }[],
  colors: {
    id: number;
    name: string;
    code: string;
  }[],
  sizes: {
    id: number;
    name: string;
    code: string;
  }[],
  translations: {
    [language: string]: {
      name: string;
      slug: string;
      short_description: string;
      description: string;
    }
  };
  seoData?: SeoDataTypes;
};

export type CreateUpdateProductTypes = {
  status: number;
  display_order: number;
  sku?: string;
  totalInit: number;
  stock: number;
  thumbnail: string;
  galleries: string[];
  price: number;
  priceInit: number;
  sale_percent: number;
  categories: number[];
  colors: number[];
  sizes: number[];
  translations?: {
    [key: string]: {
      productData: {
        name: string;
        slug: string;
        short_description: string;
        description: string;
      }
    }
  };
  seo?: SeoDataTypes;
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
