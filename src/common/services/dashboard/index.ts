import axiosInstance from '../common/instance';

import {
  TopActivityLogsTypes,
  GaSummariesParamsTypes,
  GaSummariesTypes,
  GaPagesTrackingTypes,
  GaUsersTracking,
  QuickActionSummaryType,
  QuickActionSummaryParams,
  GaPageTrackingTypes,
  GaPageTrackingParamsTypes,
  GaLocationsTrackingTypes,
  DateParams,
  DeviceList,
  GaVisitorParamsTypes,
  GaVisitorTracking,
} from './types';

const prefixPath = 'dashboard/';

export const getTopActivityLogsService = async (): Promise<
  TopActivityLogsTypes[]
> => {
  const res = await axiosInstance.get(`${prefixPath}top-activity-logs`);
  return res.data.data;
};
/**
 * ga Key
 * identifier, users, sessions, avgSessionDuration, pageviewsPerSession,
 * newUsers, bounceRate, adMatchedQuery
 */

const postGaSummariesService = async (
  params: GaSummariesParamsTypes
): Promise<GaSummariesTypes[]> => {
  /**
   * metrics: sessions, activeUsers
   * groupBy: date, yearMonth
   */
  const res = await axiosInstance.post(`${prefixPath}ga-summaries`, params);
  return res.data.data;
};

export const postGaPagesTrackingService = async (
  params: GaSummariesParamsTypes
): Promise<GaPagesTrackingTypes[]> => {
  /**
   * Metric: newUsers, engagedSessions, engagementRate,
   * bounceRate, itemViews, screenPageViewsPerSession, screenPageViews
   */
  const res = await axiosInstance.post(
    `${prefixPath}ga-pages-tracking`,
    params
  );
  return res.data.data;
};

export const postGaUsersTrackingService = async (
  params: GaSummariesParamsTypes
): Promise<GaUsersTracking[]> => {
  // region, country, deviceCategory, browser
  const res = await axiosInstance.post(
    `${prefixPath}ga-users-tracking`,
    params
  );
  return res.data.data;
};
export const getGaVisitorTrackingService = async (
  params: GaVisitorParamsTypes
): Promise<GaVisitorTracking[]> => {
  const res = await axiosInstance.get(`${prefixPath}ga-visitors-tracking`, { params });
  return res.data.data;
};

export const quickActionSummariesService = async (
  params: QuickActionSummaryParams
): Promise<QuickActionSummaryType[]> => {
  const res = await axiosInstance.get(
    `${prefixPath}${params.prefix}-summaries`
  );
  return res.data.data;
};

export const getGAPageTrackingList = async (
  params: GaPageTrackingParamsTypes
): Promise<GaPageTrackingTypes[]> => {
  const res = await axiosInstance.get(`${prefixPath}ga-pages-tracking`, { params });
  return res.data.data;
};

export const getGaLocationTracking = async (
  params: DateParams
): Promise<GaLocationsTrackingTypes[]> => {
  // region, country, deviceCategory, browser
  const res = await axiosInstance.get(`${prefixPath}ga-locations-tracking`, { params });
  return res.data.data;
};

export const getDeviceTrackingService = async (
  params: DateParams,
): Promise<DeviceList[]> => {
  const res = await axiosInstance.get(`${prefixPath}ga-devices-tracking`, { params });
  return res.data.data;
};

export default postGaSummariesService;
