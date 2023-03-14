import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import newsImg from 'common/assets/images/news_img.png';
import pageImg from 'common/assets/images/page_img.png';
import QuickAction from 'common/components/QuickAction';
import { StatusQuickActionType } from 'common/components/QuickAction/QuickActionCard';
import { quickActionSummariesService } from 'common/services/dashboard';
import { ROUTE_PATHS } from 'common/utils/constant';

interface SubjectCounterListProps {
  title: string;
}

const SubjectCounterList: React.FC<SubjectCounterListProps> = ({ title }) => {
  const { t } = useTranslation();
  const navigator = useNavigate();

  const { data: pageResponse, isLoading: loadingPage } = useQuery(
    ['pageSummariesServices'],
    () => quickActionSummariesService({
      prefix: 'page'
    }),
  );
  const { data: newsResponse, isLoading: loadingnews } = useQuery(
    ['newsSummariesServices'],
    () => quickActionSummariesService({
      prefix: 'news'
    }),
  );

  const pageData = useMemo(() => {
    if (pageResponse && pageResponse.length) {
      return {
        thumbnail: pageImg,
        alt: 'pageImg',
        type: 'page',
        typeLabel: t('dashboard.page'),
        postStatusList: pageResponse.map((ele) => ({
          status: ele.status as StatusQuickActionType,
          amount: ele.count
        })),
        productivityPerCent:
          Math.round((pageResponse[pageResponse.length - 1].count
            / pageResponse.reduce((acc, cur) => cur.count + acc, 0)) * 100),
        handleSeeMore: () => navigator(`${ROUTE_PATHS.PAGE_MANAGEMENT}`),
      };
    }
    return {};
  }, [pageResponse, t, navigator]);

  const newsData = useMemo(() => {
    if (newsResponse && newsResponse.length) {
      return {
        thumbnail: newsImg,
        alt: 'newsImg',
        type: 'news',
        typeLabel: t('dashboard.news'),
        postStatusList: newsResponse.map((ele) => ({
          status: ele.status as StatusQuickActionType,
          amount: ele.count
        })),
        productivityPerCent:
          Math.round((newsResponse[newsResponse.length - 1].count
            / newsResponse.reduce((acc, cur) => cur.count + acc, 0)) * 100),
        handleSeeMore: () => navigator(`${ROUTE_PATHS.NEWS_MANAGEMENT}`),
      };
    }
    return {};
  }, [newsResponse, t, navigator]);

  return (
    <div className="p-home_subject">
      <QuickAction
        title={title}
        dataList={[pageData, newsData]}
        isLoading={loadingPage || loadingnews}
      />
    </div>
  );
};
export default SubjectCounterList;
