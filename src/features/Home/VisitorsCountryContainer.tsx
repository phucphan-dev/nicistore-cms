import moment from 'moment';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import VisitorsCountry from 'common/components/VisitorsCountry';
import { getGaLocationTracking } from 'common/services/dashboard';
import { defaultSessionsCode } from 'common/utils/constant';

const defaultDate = [
  moment(new Date()).subtract(1, 'months').format('YYYY-MM-DD'),
  moment(new Date()).format('YYYY-MM-DD'),
];

const VisitorsCountryContainer: React.FC = () => {
  const [date, setDate] = useState(defaultDate);
  const { t } = useTranslation();

  const { data, isLoading, isFetching } = useQuery(
    ['visitorCountry', date],
    () => getGaLocationTracking({
      from: date[0],
      to: date[1],
    }),
    { enabled: date.length === 2 }
  );

  const sessionRatioObj = useMemo(() => {
    if (data && data.length > 0) {
      const totalSession = data?.reduce((total, cur) => total + cur.sessions, 0);

      const hanoiSession = data.filter(
        (item) => item.cityId === defaultSessionsCode.hanoiCode
          || item.cityId === defaultSessionsCode.sontayCode
      )?.reduce((total, cur) => total + cur.sessions, 0);

      const saigonSessionRatio = parseFloat((((data.find((item) => item.cityId
        === defaultSessionsCode.saigonCode)?.sessions || 0) / totalSession) * 100).toFixed(2));

      const danangSessionRatio = parseFloat((((data.find((item) => item.cityId
        === defaultSessionsCode.danangCode)?.sessions || 0) / totalSession) * 100).toFixed(2));

      const hanoiSessionRatio = parseFloat(((hanoiSession / totalSession) * 100).toFixed(2));

      const otherSessionRatio = parseFloat((
        100 - (hanoiSessionRatio + danangSessionRatio + saigonSessionRatio)).toFixed(2));
      return {
        hn: {
          value: hanoiSessionRatio,
          title: 'Hà Nội'
        },
        dn: {
          value: danangSessionRatio,
          title: 'Đà Nẵng'
        },
        hcm: {
          value: saigonSessionRatio,
          title: 'Hồ Chí Minh'
        },
        differ: {
          value: otherSessionRatio,
          title: t('dashboard.others')
        }
      };
    }
    return undefined;
  }, [data, t]);
  return (
    <VisitorsCountry
      title={t('dashboard.country')}
      defaultDate={defaultDate}
      info={sessionRatioObj}
      handleChangeRange={(dateRange) => setDate(dateRange)}
      loading={isLoading || isFetching}
    />
  );
};

export default VisitorsCountryContainer;
