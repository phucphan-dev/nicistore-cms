import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from 'app/store';
import HeaderPage from 'common/components/HeaderPage';
import PageTable from 'common/components/PageTable';
import { deleteCustomerService, getAllCustomerServices } from 'common/services/customer';
import { CustomerData } from 'common/services/customer/types';
import { deleteProductCategoriesService } from 'common/services/products';
import { ROUTE_PATHS } from 'common/utils/constant';
import { formatDateTime } from 'common/utils/functions';

export type CustomerTypes = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  emailVerifiedAt: string;
};

const convertCustomer = (data: CustomerData[]): CustomerTypes[] => {
  if (!data.length) return [];
  return data.map((val) => ({ ...val }));
};

const CustomerManagement: React.FC = () => {
  /* Hooks */
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /* Selectors */
  const {
    defaultPageSize, defaultWebsiteLanguage,
  } = useAppSelector((state) => state.system);

  /* States */
  const [currentPage, setCurrentPage] = useState(1);
  const [currentView, setCurrentView] = useState(defaultPageSize);
  const [keyword, setKeyword] = useState('');

  const queryKey = ['getAllCustomer', keyword, currentPage, currentView];

  /* Queries */
  const { data: customers, isLoading } = useQuery(
    queryKey,
    () => getAllCustomerServices({
      keyword, page: currentPage, limit: currentView
    }),
  );

  const { mutate: deleteMutate, isLoading: deleteLoading } = useMutation(
    ['deleteCustomer'],
    async (ids: number[]) => deleteCustomerService({ ids }),
    {
      onSuccess: () => {
        message.success(t('message.deleteSuccess'));
        queryClient.invalidateQueries(queryKey);
      },
      onError: () => {
        message.error(t('message.deleteError'));
      }

    }
  );

  /* Datas */
  const categoriesData = useMemo(() => {
    if (customers) {
      return convertCustomer(customers.data);
    }
    return [];
  }, [customers]);

  /* Variables */
  const columns: ColumnsType<CustomerTypes> = [
    {
      title: 'ID',
      key: 'id',
      width: 55,
      align: 'center',
      fixed: 'left',
      sorter: {
        compare: (a: CustomerTypes, b: CustomerTypes) => a.id - b.id,
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: CustomerTypes) => (
        <Typography.Text>
          {data.id}
        </Typography.Text>
      ),
    },
    // --- Tiêu đề
    {
      title: t('system.title'),
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: {
        compare: (
          a: CustomerTypes,
          b: CustomerTypes
        ) => a.fullName.localeCompare(b.fullName)
      },
      sortDirections: ['descend', 'ascend'],
      render: (_: string, data: any) => (
        <Typography.Text
          onClick={() => navigate(`${ROUTE_PATHS.CUSTOMER_DETAIL}?id=${data.id}&locale=${defaultWebsiteLanguage}`)}
          style={{ color: '#4a4a4a', cursor: 'pointer' }}
        >
          {data.name}
        </Typography.Text>
      ),
    },
    {
      title: t('system.status'),
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (_name: string, data: CustomerTypes) => (
        <Typography.Text>
          {data.active ? 'Đã xác minh' : 'Chưa xác minh'}
        </Typography.Text>
      ),
    },
    {
      title: t('system.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: {
        compare: (a: CustomerTypes, b: CustomerTypes) => {
          const aDate = new Date(a.createdAt);
          const bDate = new Date(b.createdAt);
          return Number(aDate) - Number(bDate);
        },
      },
      sortDirections: ['descend', 'ascend'],
      render: (_: string, data: any) => (
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
        compare: (a: CustomerTypes, b: CustomerTypes) => {
          const aDate = new Date(a.updatedAt);
          const bDate = new Date(b.updatedAt);
          return Number(aDate) - Number(bDate);
        },
      },
      sortDirections: ['descend', 'ascend'],
      render: (_: string, data: any) => (
        <Typography.Text
          style={{ color: '#4a4a4a', cursor: 'pointer' }}
        >
          {formatDateTime(data.updatedAt)}
        </Typography.Text>
      ),
    },
  ];

  /* Functions */
  const onDelete = async (data: CustomerTypes[], lang?: string) => {
    if (lang === 'all' || lang === 'allRow') {
      deleteMutate(data.map((val) => val.id));
    }
  };

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
          <Button type="primary" onClick={() => navigate(`${ROUTE_PATHS.CUSTOMER_DETAIL}?locale=${defaultWebsiteLanguage}`)}>
            <PlusOutlined />
            {t('system.create')}
          </Button>
        )}
      />
      <div className="t-mainlayout_wrapper">
        <PageTable
          handleDelete={onDelete}
          handleSearch={setKeyword}
          isLoading={isLoading || deleteLoading}
          handleEditPage={(id, _, locale) => {
            navigate(`${ROUTE_PATHS.CUSTOMER_DETAIL}?id=${id}&locale=${locale}`);
          }}
          handleCreatePage={(id, _, locale) => {
            navigate(`${ROUTE_PATHS.CUSTOMER_DETAIL}?id=${id}&locale=${locale}`);
          }}
          tableProps={{
            initShowColumns: ['id', 'name', 'status'],
            columns,
            pageData: categoriesData,
            currentPage,
            pageSize: currentView,
            handleSetCurrentPage,
            handleSetCurrentView,
            total: customers?.meta.total || 1,
            noDeleteLanguage: true,
          }}
          statusDataTable={{
            canChangeStatusApprove: false,
          }}
        />
      </div>
    </>
  );
};

export default CustomerManagement;
