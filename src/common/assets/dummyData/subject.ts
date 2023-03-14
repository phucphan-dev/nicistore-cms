import newsImg from 'common/assets/images/news_img.png';
import pageImg from 'common/assets/images/page_img.png';
import { QuickActionCardProps } from 'common/components/QuickAction/QuickActionCard';
import { DeviceData } from 'common/components/SectionByDevice/DeviceCircle';

const subjectListDummy: QuickActionCardProps[] = [
  {
    thumbnail: pageImg,
    alt: 'pageImg',
    type: 'page',
    typeLabel: 'Trang',
    postStatusList:
      [
        {
          status: 1,
          amount: 34
        },
        {
          status: 7,
          amount: 12,
        },
        {
          status: 13,
          amount: 5,
        }
      ],
    productivityPerCent: 80
  },
  {
    thumbnail: newsImg,
    alt: 'newsImg',
    type: 'news',
    typeLabel: 'Tin tức',
    postStatusList:
      [
        {
          status: 1,
          amount: 10
        },
        {
          status: 7,
          amount: 1,
        },
        {
          status: 13,
          amount: 100,
        }
      ],
    productivityPerCent: 65
  },
];

export const topKeyWordsDummy = [
  {
    id: 1,
    name: 'báo cáo',
  },
  {
    id: 2,
    name: 'tuyển dụng',
  },
  {
    id: 3,
    name: 'tin tức',
  },
];

const desktop: DeviceData = {
  percent: 60,
  amount: 100,
};
const tablet: DeviceData = {
  percent: 30,
  amount: 1200,
};
const mobile: DeviceData = {
  percent: 10,
  amount: 800,
};

export const dataDeviceList = {
  desktop,
  tablet,
  mobile,
};

export const barData = {
  labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
  datasets: [
    {
      data: [200, 500, 1500, 800, 1200, 3000, 2800],
      backgroundColor: '#8BC441',
      barThickness: 32,
      borderRadius: 8,
      label: 'USD',
    },
  ],
};

export default subjectListDummy;
