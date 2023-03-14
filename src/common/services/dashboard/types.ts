export type TopActivityLogsTypes = {
  id: number;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  updatedAt: string;
  actionName: string;
  modelId: number;
  modelName: string;
  modelData?: {
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

export type GaSummariesParamsTypes = {
  from: string;
  to: string;
  metrics?: string[];
  dimensions?: string[];
  groupBy?: string;
};

export type GaVisitorParamsTypes = {
  from: string;
  to: string;
};

export type GaSummariesTypes = {
  date?: string;
  sessions?: number;
  activeUsers?: number;
  year?: number;
  month?: 2;
  yearMonth?: string;
};

export type GaPagesTrackingTypes = {
  bounceRate: number;
  engagedSessions: number;
  engagementRate: number;
  itemViews: number;
  newUsers: number;
  pageLocation: string;
  screenPageViews: number;
  screenPageViewsPerSession: number;
};

export type GaUsersTracking = {
  newUsers: number;
  activeUsers: number;
  region: string;
  country: string;
  deviceCategory: string;
  browser: string;
};

export type GaVisitorTracking = {
  sessions: number,
  activeUsers: number,
  newUsers: number,
  totalUsers: number,
  date: string
};

export type QuickActionSummaryType = {
  status: number;
  count: number;
};

export type QuickActionSummaryParams = {
  prefix: 'page' | 'news';
};

export type DateParams = {
  from: string;
  to: string;
};

export type GaLocationsTrackingTypes = {
  sessions: number;
  cityId: string;
};

export type GaPageGroupBy = '1days' | '7days' | '30days';

export type GaPageTrackingParamsTypes = {
  groupBy: GaPageGroupBy
};
export type GaPageTrackingTypes = {
  pageLocation: string,
  pageTitle: string,
  current: number,
  previous: number,
  ratio: number
};

export type DeviceList = {
  deviceCategory: string;
  sessions: number;
};
