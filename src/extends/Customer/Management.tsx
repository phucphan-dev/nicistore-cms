import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button, message, Modal, Space, Typography
} from 'antd';
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
      title: t('customer.name'),
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
          {data.fullName}
        </Typography.Text>
      ),
    },
    {
      title: t('system.email'),
      dataIndex: 'email',
      key: 'email',
      sorter: {
        compare: (
          a: CustomerTypes,
          b: CustomerTypes
        ) => a.email.localeCompare(b.email)
      },
      sortDirections: ['descend', 'ascend'],
      render: (_: string, data: any) => (
        <Typography.Text>
          {data.email}
        </Typography.Text>
      ),
    },
    {
      title: t('customer.phone'),
      dataIndex: 'phone',
      key: 'phone',
      render: (_: string, data: any) => (
        <Typography.Text>
          {data.phone}
        </Typography.Text>
      ),
    },
    {
      title: t('system.status'),
      dataIndex: 'active',
      key: 'active',
      width: 160,
      render: (_name: string, data: CustomerTypes) => (
        <Typography.Text>
          {data.active ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
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
      render: (_: string, data: CustomerTypes) => (
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
      render: (_: string, data: CustomerTypes) => (
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
      render: (_name: string, data: CustomerTypes) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`${ROUTE_PATHS.CUSTOMER_DETAIL}?id=${data.id}&locale=${defaultWebsiteLanguage}`)}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                className: 't-pagetable_deleteRecordModal',
                autoFocusButton: 'cancel',
                title: t('message.confirmDeleteRecord'),
                okText: t('system.ok'),
                cancelText: t('system.cancel'),
                cancelButtonProps: {
                  type: 'primary',
                },
                okButtonProps: {
                  type: 'default',
                },
                onOk: () => {
                  deleteMutate([data.id]);
                },
              });
            }}
          />
        </Space>
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
          <Button type="primary" onClick={() => navigate(`${ROUTE_PATHS.CUSTOMER_DETAIL}?locale=${defaultWebsiteLanguage}`)}>
            <PlusOutlined />
            {t('system.create')}
          </Button>
        )}
      />
      <div className="t-mainlayout_wrapper">
        <PageTable
          handleSearch={setKeyword}
          isLoading={isLoading || deleteLoading}
          tableProps={{
            initShowColumns: ['id', 'fullName', 'email', 'phone', 'active', 'action'],
            columns,
            pageData: categoriesData,
            currentPage,
            pageSize: currentView,
            handleSetCurrentPage,
            handleSetCurrentView,
            total: customers?.meta.total || 1,
            noDeleteLanguage: true,
            noBaseCol: true
          }}
          noCheckbox
        />
      </div>
    </>
  );
};

export default CustomerManagement;
