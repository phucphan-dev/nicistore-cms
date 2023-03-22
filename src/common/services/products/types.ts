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
  parentId?: number;
  status?: number;
  displayOrder?: number;
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
    displayOrder: number;
    code: string;
    stock: number;
    totalInit: number;
    thumbnail: string;
    galleries: string[];
    price: number;
    priceInit: number;
    salePercent: number;
    featured: boolean;
    createdAt: string;
    updatedAt: string;
  };
  categories: {
    id: number;
    name: string;
    slug: string;
  }[],
  colorSize: {
    color: {
      id: number;
      name: string;
      code: string;
    },
    size: {
      id: number;
      name: string;
      code: string;
    },
    quantity: number;
  }[],
  relatedIds: number[];
  translations: {
    [language: string]: {
      name: string;
      slug: string;
      shortDescription: string;
      description: string;
    }
  };
  seoData?: SeoDataTypes;
};

export type ProductColorSizeTypes = {
  sizeId: number | null;
  colorId: number | null;
  quantity: number;
};

export type CreateUpdateProductTypes = {
  status: number;
  displayOrder: number;
  code: string;
  featured: boolean;
  stock: number;
  totalInit: number;
  thumbnail: string;
  galleries: string[];
  price: number;
  priceInit: number;
  salePercent: number;
  categories: number[];
  colorSize: ProductColorSizeTypes[];
  relatedIds: number[];
  translations?: {
    [language: string]: {
      productData: {
        name: string;
        slug: string;
        shortDescription: string;
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
  displayOrder: number;
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
  displayOrder: number;
  code: string;
  name: string;
};
