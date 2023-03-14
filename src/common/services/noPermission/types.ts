export type DropdownCodeParamsTypes = {
  type: string;
  locale?: string;
  filter?: BaseFilterParams;
};

export type Links = {
  self: string;
  first: string;
  prev: null;
  next: null;
  last: string;
};

export type Meta = {
  totalPages: number;
  limit: number;
  total: number;
  page: number;
};

export type DropdownDataType = {
  id: number;
  slug: string;
  text: string;
};

export type DropdownCodeDataTypes = {
  data?: DropdownDataType[];
  links?: Links;
  meta?: Meta;
  name?: string;
  founded?: number;
  members?: string[];
};

export type GetDropdownTypesParamsTypes = {
  type: string;
  locale: string;
};

export type DropdownTypeTypes = {
  id: number;
  slug: string;
  text: string;
};

export type AdvancedFilterValueType = 'boolean' | 'string' | 'numeric' | 'date' | 'datetime' | 'modelStatus' | 'newsCategoryId' | 'faqCategoryId' | 'contactStatus';

export type AdvancedFilterTypes = {
  [module: string]: {
    [field: string]: {
      [type: string]: {
        dataType: AdvancedFilterValueType
      }
    }
  }
};
