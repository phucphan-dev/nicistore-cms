import {
  Card,
  Col,
  Row,
  Space,
  Typography,
} from 'antd';
import React, {
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import BarChart from './BarChart';
import DeviceTracking from './DeviceTracking';
import PageTracking from './PageTracking';
import SubjectCounterList from './SubjectCounter';
import VisitorsCountryContainer from './VisitorsCountryContainer';

import { useAppSelector } from 'app/store';
import {
  topKeyWordsDummy,
} from 'common/assets/dummyData/subject';
import ActivityLogs from 'common/components/ActivityLogs';
import TopKeyWords from 'common/components/TopKeyWords';
import {
  getTopActivityLogsService,
} from 'common/services/dashboard';
import { ActivityModelType, handleActivityLink } from 'configs/activityLink';

const gutterValue = 16;

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { profileData } = useAppSelector((state) => state.auth);
  const {
    data: topActivityLogsData,
    isLoading: loadingTopActivity,
    isFetching: fetchingTopActivity,
  } = useQuery(
    'getTopActivityLogs',
    getTopActivityLogsService
  );

  const topActivityLogs = useMemo(() => {
    if (topActivityLogsData) {
      return topActivityLogsData.map((val) => {
        const { url, params } = handleActivityLink(
          val.modelName as ActivityModelType,
          val.modelId,
          val.actionName,
        );
        const arrCharName = (val.user?.name || '').match(/\b(\w)/g) || ['N', 'N'];
        arrCharName.splice(1, arrCharName.length - 2);

        return ({
          time: val.createdAt,
          name: val.user?.name,
          content: `${val.user.name} ${t(`activityLog.${val.actionName}`)}`,
          titleDesc: val.modelData?.title || '',
          alt: arrCharName.join('').toLocaleUpperCase(),
          avatar: val.user.avatar,
          bgAvatar: val.user.bgAvatar,
          link: {
            href: `${url}${params ? `?${params}` : ''}`,
            title: `${t(`activityLog.${val.actionName}`)} ${t(`activityLog.${val.modelName}`)} ${t('activityLog.with')} ID: ${val.modelId}`,
          }
        });
      });
    }
    return [];
  }, [t, topActivityLogsData]);

  return (
    <div className="p-home">
      <div className="p-home_userLabel">
        <Typography.Title
          level={1}
          style={{ color: '#002B60' }}
        >
          {`${t('system.welcome')}, ${profileData?.name}`}
        </Typography.Title>
      </div>
      <Space direction="vertical" size={gutterValue} style={{ width: '100%' }}>
        <Row gutter={[gutterValue, gutterValue]}>
          <Col span={24}>
            <Row gutter={[gutterValue, gutterValue]}>
              <Col xxl={12} lg={12} sm={24}>
                <Space direction="vertical" size={gutterValue} style={{ width: '100%' }}>
                  <SubjectCounterList
                    title={t('dashboard.quickAction')}
                  />
                </Space>
                <Card style={{ marginTop: '16px' }}>
                  <PageTracking />
                </Card>
              </Col>
              <Col xxl={12} lg={12} sm={24}>
                <div className="p-home_right">
                  <div className="p-home_activities">
                    <Card
                      type="inner"
                      style={{ height: '100%' }}
                      bodyStyle={{ height: '100%' }}
                    >
                      <ActivityLogs
                        title={t('dashboard.activity')}
                        dataList={topActivityLogs}
                        loading={loadingTopActivity || fetchingTopActivity}
                      />
                    </Card>
                  </div>
                  <div className="p-home_keywords">
                    <TopKeyWords
                      title={t('dashboard.keyword')}
                      dataList={topKeyWordsDummy}
                      handleClick={(id) => console.log(id)}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={[gutterValue, gutterValue]}>
          <Col span={24}>
            <Row gutter={[gutterValue, gutterValue]}>
              <Col xxl={12} lg={12} sm={24}>
                <VisitorsCountryContainer />
              </Col>
              <Col xxl={12} lg={12} sm={24}>
                <DeviceTracking
                  title={t('dashboard.device')}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={[gutterValue, gutterValue]}>
          <Col xxl={24}>
            <BarChart title={t('dashboard.gaUserTracking')} />
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default Home;
