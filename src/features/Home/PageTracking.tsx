import {
  Card,
  Spin,
  Table,
  Typography,
} from 'antd';
import React, {
  useCallback,
  useMemo,
  // useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import Link from 'common/components/Link';
import { getGAPageTrackingList } from 'common/services/dashboard';
import { GaPageGroupBy } from 'common/services/dashboard/types';
import mapModifiers, { checkExternalUrl } from 'common/utils/functions';

type TableData = {
  id: number;
  page: React.ReactNode;
  pageLink?: string;
  bounceRate: React.ReactNode;
  screenPageViews: number;
};

const PageTracking: React.FC = () => {
  const { t } = useTranslation();

  const columns = [
    {
      title: 'Page',
      dataIndex: 'page',
      key: 'page',
      width: 226,
    },
    {
      title: 'Page views',
      dataIndex: 'screenPageViews',
      key: 'screenPageViews',
      width: 161,
    },
    {
      title: '',
      dataIndex: 'bounceRate',
      key: 'bounceRate',
      width: 161,
    },
  ];

  const filterData = useMemo(() => [
    {
      name: t('dashboard.daily'),
      value: '1days',
    },
    {
      name: t('dashboard.7day'),
      value: '7days',
    },
    {
      name: t('dashboard.30day'),
      value: '30days'
    }
  ], [t]);

  const [currentIdx, setCurrentIdx] = useState(1);
  const { data, isFetching } = useQuery(
    ['getPagesTrackingList', currentIdx, filterData],
    () => getGAPageTrackingList({
      groupBy: filterData[currentIdx].value as GaPageGroupBy
    }),
  );

  const renderRatePage = useCallback((ratio: number | null) => {
    if (ratio) {
      return (
        <div className="p-home_rateList">
          <div className={`p-home_triangle p-home_triangle-${ratio > 0 ? 'increase' : 'decrease'}`} />
          <div className={`p-home_rateList-item p-home_rateList-item-${ratio > 0 ? 'increase' : 'decrease'}`}>
            {Math.round(ratio * 100)}
            %
          </div>
        </div>
      );
    }
    return (
      <div className="p-home_rateList">
        -
      </div>
    );
  }, []);

  const convertData = useMemo(() => (data
    ? data.map((val, idx) => ({
      id: idx + 1,
      key: `row-${String(idx)}`,
      page: (
        <div className="p-home_pageTitle">
          <Link useExternal={checkExternalUrl(val.pageLocation)} href={val.pageLocation} target="_blank">
            {val.pageTitle}
          </Link>
        </div>
      ),
      pageLink: val.pageLocation,
      screenPageViews: val.current,
      bounceRate: renderRatePage(val.ratio),
    })) as TableData[]
    : []), [data, renderRatePage]);

  return (
    <Card>
      <div className="p-home-pageViewList">
        <Typography.Title level={3}>
          {t('dashboard.gaPageTracking')}
        </Typography.Title>
        {filterData && (
          <div className="p-home-pageViewList-filter">
            {filterData.map((item, idx) => (
              <div
                className={mapModifiers(
                  'p-home-pageViewList-item',
                  currentIdx === idx ? 'active' : '',
                )}
                onClick={() => setCurrentIdx(idx)}
                key={`filter-${String(idx)}`}
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>
      <Spin spinning={isFetching}>
        <Table
          scroll={{ x: 548, y: 255 }}
          columns={columns}
          dataSource={convertData}
          pagination={false}
        />
      </Spin>
    </Card>
  );
};

export default PageTracking;
