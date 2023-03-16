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
import StatusLabel from 'common/components/StatusLabel';
import { deleteProductCategoriesService, getAllProductCategories } from 'common/services/products';
import { ProductCategoryItemTypes } from 'common/services/products/types';
import { ROUTE_PATHS } from 'common/utils/constant';
import { formatDateTime } from 'common/utils/functions';

export type ProductCategoryTypes = {
  id: number;
  name: string;
  category?: number[];
  createdAt: string;
  updatedAt: string;
  status: number;
  locale: ProductCategoryItemTypes['translations'];
};

const convertProductCategory = (data: ProductCategoryItemTypes[]): ProductCategoryTypes[] => {
  if (!data.length) return [];
  return data.map((val) => ({
    id: val.categoryData.id,
    name: val.translations.vi ? val.translations.vi.name : val.translations.en.name,
    status: val.categoryData.status,
    createdAt: val.categoryData.createdAt,
    updatedAt: val.categoryData.createdAt,
    locale: Object.fromEntries(
      Object
        .entries(val.translations)
        .map(([k, o]) => [k, { ...o, id: val.categoryData.id }])
    )
  }));
};

const ProductCategoriesManagement: React.FC = () => {
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

  const queryKey = ['product-category-getall', keyword, currentPage, currentView];

  /* Queries */
  const { data: productCategories, isLoading } = useQuery(
    queryKey,
    () => getAllProductCategories({
      keyword, page: currentPage, limit: currentView
    }),
  );

  const { mutate: deleteMutate, isLoading: deleteLoading } = useMutation(
    ['faq-delete'],
    async (ids: number[]) => deleteProductCategoriesService({ ids }),
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
    if (productCategories) {
      return convertProductCategory(productCategories.data);
    }
    return [];
  }, [productCategories]);

  /* Variables */
  const columns: ColumnsType<ProductCategoryTypes> = [
    {
      title: 'ID',
      key: 'id',
      width: 55,
      align: 'center',
      fixed: 'left',
      sorter: {
        compare: (a: ProductCategoryTypes, b: ProductCategoryTypes) => a.id - b.id,
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: ProductCategoryTypes) => (
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
          a: ProductCategoryTypes,
          b: ProductCategoryTypes
        ) => a.name.localeCompare(b.name)
      },
      sortDirections: ['descend', 'ascend'],
      render: (_: string, data: any) => (
        <Typography.Text
          onClick={() => navigate(`${ROUTE_PATHS.PRODUCT_CATEGORIES_DETAIL}?id=${data.id}&locale=${defaultWebsiteLanguage}`)}
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
      render: (_name: string, data: ProductCategoryTypes) => (
        <StatusLabel status={data.status} />
      ),
    },
    {
      title: t('system.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: {
        compare: (a: ProductCategoryTypes, b: ProductCategoryTypes) => {
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
        compare: (a: ProductCategoryTypes, b: ProductCategoryTypes) => {
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
  const onDelete = async (data: ProductCategoryTypes[], lang?: string) => {
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
          <Button type="primary" onClick={() => navigate(`${ROUTE_PATHS.PRODUCT_CATEGORIES_DETAIL}?locale=${defaultWebsiteLanguage}`)}>
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
            navigate(`${ROUTE_PATHS.PRODUCT_CATEGORIES_DETAIL}?id=${id}&locale=${locale}`);
          }}
          handleCreatePage={(id, _, locale) => {
            navigate(`${ROUTE_PATHS.PRODUCT_CATEGORIES_DETAIL}?id=${id}&locale=${locale}`);
          }}
          tableProps={{
            initShowColumns: ['id', 'name', 'status'],
            columns,
            pageData: categoriesData,
            currentPage,
            pageSize: currentView,
            handleSetCurrentPage,
            handleSetCurrentView,
            total: productCategories?.meta.total || 1,
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

export default ProductCategoriesManagement;
