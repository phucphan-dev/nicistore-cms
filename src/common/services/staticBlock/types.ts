export type StaticBlockTemplateType = {
  code: string;
  name: string;
  blocks: BlocksType;
};

type StaticBlockData = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type Template = {
  name: string;
  code: string;
};

export type StaticBlockTranslation = {
  [key: string]: {
    blocks: any;
  }
};

export type StaticBlockItemListType = {
  staticBlockData: StaticBlockData;
  template: Template;
  updater: CreatorType;
  creator: CreatorType;
};

export type CreateStaticBlockParams = {
  templateCode: string;
  name: string;
  translations: StaticBlockTranslation;
};

export type StaticBlockDataType = {
  staticBlockData: StaticBlockData;
  blocks: {
    [section: string]: any;
  };
  template: Template;
  updater: CreatorType;
  creator: CreatorType;
};
