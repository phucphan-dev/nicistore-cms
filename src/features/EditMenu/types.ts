import { DataNode } from 'antd/lib/tree';

export type MenuGenerationList = {
  title: string;
  optionList?: OptionType[];
  id: number;
};

export type MenuGenerationFormTypes = {
  referenceLink?: { value: number, label: string };
  title?: string;
  url?: string;
  target: number;
  type: string;
};

export type MenuGenerationItem = {
  id?: number;
  data: MenuGenerationFormTypes;
  dynamicId?: number;
  parentId?: number;
  children?: MenuGenerationItem[];
  live?: boolean;
  slug?: string;
  cssClass?: string;
  icon?: string;
  rel?: string;
  download?: boolean;
};

export interface MainMenuDataType extends DataNode {
  id?: number;
  link?: string;
  type?: string;
  referenceId?: number;
  reference?: {
    text?: string;
    slug?: string;
  }
  cssClass?: string;
  depth?: number;
  parentId?: number;
  download?: boolean;
  rel?: string;
  /* Dynamic data */
  target?: number;
  dynamicId?: number;
  iconFile?: string;
  rawTitle?: string;
}

export type MenuItemEditFormTypes = {
  icon?: string;
  cssClass?: string;
  link?: string;
  title: string;
  type?: string;
  target?: number;
  id?: number;
  rel?: string;
  download?: boolean;
};
