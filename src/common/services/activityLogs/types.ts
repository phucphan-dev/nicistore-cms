export type RedirectDataType = {
  id: number;
  from: string;
  to: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GetAllActivityLogsParams = {
  userId?: number;
  controller?: string;
  action?: string;
  limit?: number;
  page?: number;
  keyword?: string;
};

export type ActivityLogsDataType = {
  id: number;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  updatedAt: string;
  actionName: string;
  modelId: number;
  modelName: string;
  modelData: {
    title: string;
  };
  user: {
    id: number;
    email: string;
    name: string;
    avatar?: any;
    bgAvatar: string;
  };
};

export type ActivityLogsMetaData = {
  linkDetail: string;
};

export type ActivityLogsUserData = {
  id: number;
  email: string;
  name: string;
};

export type ActivityLogsActionsData = {
  [x: string]: {
    code: string;
    name: string;
    actions: {
      code: string;
      name: string;
    }[];
  }
};
