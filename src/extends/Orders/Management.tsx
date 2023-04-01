import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from 'app/store';
import HeaderPage from 'common/components/HeaderPage';
import PageTable from 'common/components/PageTable';
import { StatusOrderLabel } from 'common/components/StatusLabel';
import { getAllOrderService } from 'common/services/orders';
import { OrderDataTypes, OrderItem } from 'common/services/orders/types';
import { ROUTE_PATHS } from 'common/utils/constant';
import { formatDateTime, renderPrice } from 'common/utils/functions';

export type OrderTypes = {
  id: number;
  guest: {
    name: string;
    phone: string;
  };
  code: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
  status: number;
};

const convertProductCategory = (data: OrderDataTypes[]): OrderTypes[] => {
  if (!data.length) return [];
  return data.map((val) => ({
    id: val.id,
    guest: {
      name: val.name,
      phone: val.phone,
    },
    code: val.code,
    items: val.items,
    total: val.totalFinalPrice,
    status: val.status,
    createdAt: val.createdAt,
    updatedAt: val.createdAt,
  }));
};

const OrdersManagement: React.FC = () => {
  /* Hooks */
  const { t } = useTranslation();
  const navigate = useNavigate();

  /* Selectors */
  const {
    defaultPageSize, defaultWebsiteLanguage,
  } = useAppSelector((state) => state.system);

  /* States */
  const [currentPage, setCurrentPage] = useState(1);
  const [currentView, setCurrentView] = useState(defaultPageSize);
  const [keyword, setKeyword] = useState('');

  const queryKey = ['orderList', keyword, currentPage, currentView];

  /* Queries */
  const { data: orderData, isLoading } = useQuery(
    queryKey,
    () => getAllOrderService({
      keyword, page: currentPage, limit: currentView
    }),
  );

  /* Datas */
  const orderList = useMemo(() => {
    if (orderData) {
      return convertProductCategory(orderData.data);
    }
    return [];
  }, [orderData]);

  /* Variables */
  const columns: ColumnsType<OrderTypes> = [
    {
      title: 'ID',
      key: 'id',
      width: 55,
      align: 'center',
      fixed: 'left',
      sorter: {
        compare: (a: OrderTypes, b: OrderTypes) => a.id - b.id,
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: OrderTypes) => (
        <Typography.Text>
          {data.id}
        </Typography.Text>
      ),
    },
    // --- Tiêu đề
    {
      title: t('order.customer'),
      dataIndex: 'guest',
      key: 'guest',
      render: (_: string, data: OrderTypes) => (
        <Typography.Text>
          {data.guest.name}
          {' '}
          <br />
          {data.guest.phone}
        </Typography.Text>
      ),
    },
    {
      title: t('order.code'),
      dataIndex: 'code',
      key: 'code',
      render: (_: string, data: OrderTypes) => (
        <Typography.Text>
          {data.code}
        </Typography.Text>
      ),
    },
    {
      title: t('order.products'),
      dataIndex: 'items',
      key: 'items',
      render: (_: string, data: OrderTypes) => (
        <ul>
          {data.items.map((item) => (
            <li>
              <Typography.Text>
                <strong>{item.product.name}</strong>
                {' '}
                x
                {item.quantity}
                ,
                {' '}
                {item.size.name}
                ,
                {' '}
                {item.color.name}
              </Typography.Text>
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: t('order.total'),
      dataIndex: 'total',
      key: 'total',
      width: 160,
      sorter: {
        compare: (a: OrderTypes, b: OrderTypes) => a.total - b.total,
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: OrderTypes) => (
        <Typography.Text>
          {renderPrice(data.total, true, 'VNĐ')}
        </Typography.Text>
      ),
    },
    {
      title: t('system.status'),
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (_name: string, data: OrderTypes) => (
        <StatusOrderLabel status={data.status} />
      ),
    },
    {
      title: t('system.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: {
        compare: (a: OrderTypes, b: OrderTypes) => {
          const aDate = new Date(a.createdAt);
          const bDate = new Date(b.createdAt);
          return Number(aDate) - Number(bDate);
        },
      },
      sortDirections: ['descend', 'ascend'],
      render: (_: string, data: OrderTypes) => (
        <Typography.Text
          style={{ color: '#4a4a4a', cursor: 'pointer' }}
        >
          {formatDateTime(data.createdAt)}
        </Typography.Text>
      ),
    },
    {
      title: t('system.updatedAt'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: {
        compare: (a: OrderTypes, b: OrderTypes) => {
          const aDate = new Date(a.updatedAt);
          const bDate = new Date(b.updatedAt);
          return Number(aDate) - Number(bDate);
        },
      },
      sortDirections: ['descend', 'ascend'],
      render: (_: string, data: OrderTypes) => (
        <Typography.Text
          style={{ color: '#4a4a4a', cursor: 'pointer' }}
        >
          {formatDateTime(data.updatedAt)}
        </Typography.Text>
      ),
    },
    {
      title: t('system.action'),
      key: 'action',
      width: 100,
      align: 'center',
      render: (_name: string, data: OrderTypes) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => navigate(`${ROUTE_PATHS.ORDERS_DETAIL}?id=${data.id}&locale=${defaultWebsiteLanguage}`)}
        />

      ),
    },
  ];

  /* Functions */
  const handleSetCurrentPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleSetCurrentView = (view: number) => {
    setCurrentView(view);
  };

  /* Render */
  return (
    <>
      <HeaderPage
        fixed
        title={t('sidebar.productCategories')}
        rightHeader={(
          <Button type="primary" onClick={() => navigate(`${ROUTE_PATHS.ORDERS_DETAIL}?locale=${defaultWebsiteLanguage}`)}>
            <PlusOutlined />
            {t('system.create')}
          </Button>
        )}
      />
      <div className="t-mainlayout_wrapper">
        <PageTable
          handleSearch={setKeyword}
          isLoading={isLoading}
          handleEditPage={(id, _, locale) => {
            navigate(`${ROUTE_PATHS.ORDERS_DETAIL}?id=${id}&locale=${locale}`);
          }}
          handleCreatePage={(id, _, locale) => {
            navigate(`${ROUTE_PATHS.ORDERS_DETAIL}?id=${id}&locale=${locale}`);
          }}
          tableProps={{
            initShowColumns: ['id', 'guest', 'code', 'items', 'total', 'status', 'action'],
            columns,
            pageData: orderList,
            currentPage,
            pageSize: currentView,
            handleSetCurrentPage,
            handleSetCurrentView,
            total: orderData?.meta.total || 1,
            noDeleteLanguage: true,
            noBaseCol: true
          }}
          statusDataTable={{
            canChangeStatusApprove: false,
          }}
          noCheckbox
        />
      </div>
    </>
  );
};

export default OrdersManagement;
