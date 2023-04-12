import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button, message, Modal, Space, Typography
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from 'app/store';
import HeaderPage from 'common/components/HeaderPage';
import PageTable from 'common/components/PageTable';
import { StatusOrderLabel } from 'common/components/StatusLabel';
import { deletePreOrderService, getAllPreOrderService } from 'common/services/preOrder';
import { PreOrderItemData } from 'common/services/preOrder/types';
import { ROUTE_PATHS } from 'common/utils/constant';
import { formatDateTime } from 'common/utils/functions';

const PreOrderManagement: React.FC = () => {
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

  const queryKey = ['getAllPreOrder', keyword, currentPage, currentView];

  /* Queries */
  const { data: preOrders, isLoading } = useQuery(
    queryKey,
    () => getAllPreOrderService({
      keyword, page: currentPage, limit: currentView
    }),
  );

  const { mutate: deleteMutate, isLoading: deleteLoading } = useMutation(
    ['product-category-delete'],
    async (ids: number[]) => deletePreOrderService({ ids }),
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

  /* Variables */
  const columns: ColumnsType<PreOrderItemData> = [
    {
      title: 'ID',
      key: 'id',
      width: 55,
      align: 'center',
      fixed: 'left',
      sorter: {
        compare: (a: PreOrderItemData, b: PreOrderItemData) => a.id - b.id,
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: PreOrderItemData) => (
        <Typography.Text>
          {data.id}
        </Typography.Text>
      ),
    },
    // --- Tiêu đề
    {
      title: t('order.code'),
      dataIndex: 'code',
      key: 'code',
      sorter: {
        compare: (
          a: PreOrderItemData,
          b: PreOrderItemData
        ) => a.code.localeCompare(b.code)
      },
      sortDirections: ['descend', 'ascend'],
      render: (_: string, data: PreOrderItemData) => (
        <Typography.Text
          onClick={() => navigate(`${ROUTE_PATHS.PREORDER_DETAIL}?id=${data.id}&locale=${defaultWebsiteLanguage}`)}
          style={{ color: '#4a4a4a', cursor: 'pointer' }}
        >
          {data.code}
        </Typography.Text>
      ),
    },
    {
      title: t('order.customer'),
      dataIndex: 'fullname',
      key: 'fullname',
      render: (_: string, data: PreOrderItemData) => (
        <Typography.Text>
          {data.fullname}
          <br />
          {data.phone}
          <br />
          {data.email}
        </Typography.Text>
      ),
    },
    {
      title: t('order.guestNote'),
      dataIndex: 'guestNote',
      key: 'guestNote',
      render: (_: string, data: PreOrderItemData) => (
        <Typography.Text>
          {data.guestNote}
        </Typography.Text>
      ),
    },
    {
      title: t('system.status'),
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (_name: string, data: PreOrderItemData) => (
        <StatusOrderLabel status={data.status} />
      ),
    },
    {
      title: t('system.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: {
        compare: (a: PreOrderItemData, b: PreOrderItemData) => {
          const aDate = new Date(a.createdAt);
          const bDate = new Date(b.createdAt);
          return Number(aDate) - Number(bDate);
        },
      },
      sortDirections: ['descend', 'ascend'],
      render: (_: string, data: PreOrderItemData) => (
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
        compare: (a: PreOrderItemData, b: PreOrderItemData) => {
          const aDate = new Date(a.updatedAt);
          const bDate = new Date(b.updatedAt);
          return Number(aDate) - Number(bDate);
        },
      },
      sortDirections: ['descend', 'ascend'],
      render: (_: string, data: PreOrderItemData) => (
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
      render: (_name: string, data: PreOrderItemData) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`${ROUTE_PATHS.PREORDER_DETAIL}?id=${data.id}&locale=${defaultWebsiteLanguage}`)}
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
          <Button type="primary" onClick={() => navigate(`${ROUTE_PATHS.PREORDER_DETAIL}?locale=${defaultWebsiteLanguage}`)}>
            <PlusOutlined />
            {t('system.create')}
          </Button>
        )}
      />
      <div className="t-mainlayout_wrapper">
        <PageTable
          handleSearch={setKeyword}
          isLoading={isLoading || deleteLoading}
          handleCreatePage={(id, _, locale) => {
            navigate(`${ROUTE_PATHS.PREORDER_DETAIL}?id=${id}&locale=${locale}`);
          }}
          tableProps={{
            initShowColumns: ['id', 'code', 'fullname', 'guestNote', 'status', 'action'],
            columns,
            pageData: preOrders?.data || [],
            currentPage,
            pageSize: currentView,
            handleSetCurrentPage,
            handleSetCurrentView,
            total: preOrders?.meta.total || 1,
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

export default PreOrderManagement;
