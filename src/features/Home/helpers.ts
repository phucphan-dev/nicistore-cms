import { GaSummariesTypes, GaUsersTracking } from 'common/services/dashboard/types';

const parseChartData = (data?: GaSummariesTypes[], metric?: string) => (data ? ({
  labels: data.map((val) => val.date),
  datasets: [
    {
      label: 'Number',
      data: data.map((val) => val[metric as keyof GaSummariesTypes]),
      fill: false,
      backgroundColor: '#8BC441',
      borderColor: '#8BC441',
      pointHoverRadius: 5,
      pointRadius: 1,
    }
  ]
}) : undefined);

export const summarizeByCategory = (key: string, data?: GaUsersTracking[]) => {
  if (!data) return [];
  const res = Array.from(data.reduce(
    (m, curr) => m.set(
      curr[key as keyof GaUsersTracking],
      (m.get(curr[key as keyof GaUsersTracking]) || 0) + curr.activeUsers,
    ),
    new Map()
  ), ([title, activeUsers]) => ({ [key]: title, activeUsers }));
  const res2 = Array.from(data.reduce(
    (m, curr) => m.set(
      curr[key as keyof GaUsersTracking],
      (m.get(curr[key as keyof GaUsersTracking]) || 0) + curr.newUsers,
    ),
    new Map()
  ), ([title, newUsers]) => ({ [key]: title, newUsers }));

  return res.map((item, i) => ({ ...item, ...res2[i] }));
};

export default parseChartData;
