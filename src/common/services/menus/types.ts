export type MenusParamsTypes = {
  title: string;
  code: string;
  locale: string,
  items?: [
    {
      id: number;
      referenceId: number;
      icon: string,
      cssClass: string;
      link: string;
      title: string;
      children: [
        {}
      ],
      type: string;
      target: string;
      rel?: string;
      download?: boolean;
    }
  ]
};

export type MenuItemTypes = {
  id: number;
  code: string;
  locale: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type MenuByCodeParamsTypes = {
  code: string;
  locale: string;
};

export type MenuItemRecursiveTypes = {
  children?: MenuByCodeItemTypes[];
} & MenuByCodeItemTypes;

export type MenuByCodeItemTypes = {
  createdAt: string;
  cssClass: string;
  depth: number;
  icon: string;
  id: number;
  ltf: number;
  link: string;
  reference?: {
    text?: string;
    slug?: string;
  }
  referenceId: number;
  parentId: number;
  rgt: number;
  target: string;
  title: string;
  type?: string;
  updatedAt: string;
  rel?: string;
  download?: boolean;
};

export type MenuByCodeTypes = {
  menuData: {
    id: number;
    code: string;
    locale: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
  menuItems: MenuByCodeItemTypes[];
};

export type MenuItemDataType = {
  referenceId?: number;
  icon?: string;
  cssClass?: string;
  link?: string;
  title: string;
  type?: string;
  target?: string;
  id?: number;
  rel?: string;
  download?: boolean;
};

export type UpdateMenuItemParamsTypes = MenuItemDataType & {
  children?: MenuItemDataType[];
};

export type CreateUpdateMenuParamsTypes = {
  title?: string;
  code?: string;
  locale?: string;
  items?: UpdateMenuItemParamsTypes[];
};

export type DeleteMenuParamsTypes = {
  ids: number[];
};

export type ReferenceDataTypes = string[];
