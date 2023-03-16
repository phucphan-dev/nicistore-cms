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
import StatusLabel from 'common/components/StatusLabel';
import { deleteProductSizesService, getAllProductSizes } from 'common/services/products';
import { ProductSizeItemTypes } from 'common/services/products/types';
import { ROUTE_PATHS } from 'common/utils/constant';
import { formatDateTime } from 'common/utils/functions';

export type ProductSizesTypes = {
  id: number;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  status: number;
};

const convertProductSizes = (data: ProductSizeItemTypes[]): ProductSizesTypes[] => {
  if (!data.length) return [];
  return data.map((val) => ({
    id: val.id,
    name: val.name,
    code: val.code,
    status: val.status,
    createdAt: val.createdAt,
    updatedAt: val.createdAt,
  }));
};

const ProductSizesManagement: React.FC = () => {
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

  const queryKey = ['product-size-getall', keyword, currentPage, currentView];

  /* Queries */
  const { data: productSizes, isLoading } = useQuery(
    queryKey,
    () => getAllProductSizes({
      keyword, page: currentPage, limit: currentView
    }),
  );

  const { mutate: deleteMutate, isLoading: deleteLoading } = useMutation(
    ['size-delete'],
    async (ids: number[]) => deleteProductSizesService({ ids }),
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
  const sizesData = useMemo(() => {
    if (productSizes) {
      return convertProductSizes(productSizes.data);
    }
    return [];
  }, [productSizes]);

  /* Variables */
  const columns: ColumnsType<ProductSizesTypes> = [
    {
      title: 'ID',
      key: 'id',
      width: 55,
      align: 'center',
      fixed: 'left',
      sorter: {
        compare: (a: ProductSizesTypes, b: ProductSizesTypes) => a.id - b.id,
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: ProductSizesTypes) => (
        <Typography.Text>
          {data.id}
        </Typography.Text>
      ),
    },
    // --- Tiêu đề
    {
      title: t('system.title'),
      dataIndex: 'name',
      key: 'name',
      sorter: {
        compare: (
          a: ProductSizesTypes,
          b: ProductSizesTypes
        ) => a.name.localeCompare(b.name)
      },
      sortDirections: ['descend', 'ascend'],
      render: (_: string, data: any) => (
        <Typography.Text
          onClick={() => navigate(`${ROUTE_PATHS.PRODUCT_SIZES_DETAIL}?id=${data.id}&locale=${defaultWebsiteLanguage}`)}
          style={{ color: '#4a4a4a', cursor: 'pointer' }}
        >
          {data.name}
        </Typography.Text>
      ),
    },
    {
      title: t('system.code'),
      dataIndex: 'code',
      key: 'code',
      sorter: {
        compare: (
          a: ProductSizesTypes,
          b: ProductSizesTypes
        ) => a.code.localeCompare(b.code)
      },
      sortDirections: ['descend', 'ascend'],
      render: (_: string, data: any) => (
        <Typography.Text>
          {data.code}
        </Typography.Text>
      ),
    },
    {
      title: t('system.status'),
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (_name: string, data: ProductSizesTypes) => (
        <StatusLabel status={data.status} />
      ),
    },
    {
      title: t('system.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: {
        compare: (a: ProductSizesTypes, b: ProductSizesTypes) => {
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
        compare: (a: ProductSizesTypes, b: ProductSizesTypes) => {
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
    {
      title: t('system.action'),
      key: 'action',
      width: 100,
      align: 'center',
      render: (_name: string, data: ProductSizesTypes) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`${ROUTE_PATHS.PRODUCT_SIZES_DETAIL}?id=${data.id}&locale=${defaultWebsiteLanguage}`)}
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
  const onDelete = async (data: ProductSizesTypes[], lang?: string) => {
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
          <Button type="primary" onClick={() => navigate(`${ROUTE_PATHS.PRODUCT_SIZES_DETAIL}?locale=${defaultWebsiteLanguage}`)}>
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
            navigate(`${ROUTE_PATHS.PRODUCT_SIZES_DETAIL}?id=${id}&locale=${locale}`);
          }}
          handleCreatePage={(id, _, locale) => {
            navigate(`${ROUTE_PATHS.PRODUCT_SIZES_DETAIL}?id=${id}&locale=${locale}`);
          }}
          tableProps={{
            initShowColumns: ['id', 'name', 'code', 'status', 'action'],
            columns,
            pageData: sizesData,
            currentPage,
            noBaseCol: true,
            pageSize: currentView,
            handleSetCurrentPage,
            handleSetCurrentView,
            total: productSizes?.meta.total || 1,
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

export default ProductSizesManagement;
