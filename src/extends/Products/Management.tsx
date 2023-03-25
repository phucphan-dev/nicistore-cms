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
import PriceSale from 'common/components/PriceSale';
import StatusLabel from 'common/components/StatusLabel';
import { deleteProductService, getAllProductService } from 'common/services/products';
import { ColorSizeData, ProductItemTypes } from 'common/services/products/types';
import { ROUTE_PATHS } from 'common/utils/constant';
import { formatDateTime } from 'common/utils/functions';

export type ProductTypes = {
  id: number;
  name: string;
  colorSize: ColorSizeData[];
  createdAt: string;
  updatedAt: string;
  status: number;
  price: {
    original: number;
    salePercent?: number;
  };
  locale: ProductItemTypes['translations'];
};

const convertProduct = (data: ProductItemTypes[]): ProductTypes[] => {
  if (!data.length) return [];
  return data.map((val) => ({
    id: val.productData.id,
    name: val.translations.vi ? val.translations.vi.name : val.translations.en.name,
    colorSize: val.colorSize,
    status: val.productData.status,
    createdAt: val.productData.createdAt,
    updatedAt: val.productData.createdAt,
    price: {
      original: val.productData.price,
      salePercent: val.productData.salePercent > 0 ? val.productData.salePercent : undefined
    },
    locale: Object.fromEntries(
      Object
        .entries(val.translations)
        .map(([k, o]) => [k, { ...o, id: val.productData.id }])
    )
  }));
};

const ProductManagement: React.FC = () => {
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

  const queryKey = ['product-getall', keyword, currentPage, currentView];

  /* Queries */
  const { data: products, isLoading } = useQuery(
    queryKey,
    () => getAllProductService({
      keyword, page: currentPage, limit: currentView
    }),
  );

  const { mutate: deleteMutate, isLoading: deleteLoading } = useMutation(
    ['product-delete'],
    async (ids: number[]) => deleteProductService({ ids }),
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
  const productData = useMemo(() => {
    if (products) {
      return convertProduct(products.data);
    }
    return [];
  }, [products]);

  const stockDetail = (colorSize: ColorSizeData[]) => {
    const reduceData = colorSize.reduce((prev: any, curr) => ({
      ...prev,
      [curr.color.name]: prev[curr.color.name] ? [...prev[curr.color.name],
      { size: curr.size.name, quantity: curr.quantity }]
        : [{ size: curr.size.name, quantity: curr.quantity }]
    }), {});
    return (
      <>
        {Object.keys(reduceData).map((item) => (
          <>
            <Typography.Title level={5}>
              Màu:
              {' '}
              {item}
              <br />
            </Typography.Title>
            <ul>
              {reduceData[item].map((it: any) => <li>{`Size: ${it.size} --- SL: ${it.quantity}`}</li>)}
            </ul>
          </>
        ))}
      </>
    );
  };

  /* Variables */
  const columns: ColumnsType<ProductTypes> = [
    {
      title: 'ID',
      key: 'id',
      width: 55,
      align: 'center',
      fixed: 'left',
      sorter: {
        compare: (a: ProductTypes, b: ProductTypes) => a.id - b.id,
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: ProductTypes) => (
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
          a: ProductTypes,
          b: ProductTypes
        ) => a.name.localeCompare(b.name)
      },
      sortDirections: ['descend', 'ascend'],
      render: (_: string, data: ProductTypes) => (
        <Typography.Text
          onClick={() => navigate(`${ROUTE_PATHS.PRODUCT_DETAIL}?id=${data.id}&locale=${defaultWebsiteLanguage}`)}
          style={{ color: '#4a4a4a', cursor: 'pointer' }}
        >
          {data.name}
        </Typography.Text>
      ),
    },
    {
      title: t('product.stock'),
      dataIndex: 'colorSize',
      key: 'colorSize',
      render: (_: string, data: ProductTypes) => stockDetail(data.colorSize),
    },
    {
      title: t('product.price'),
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (_: string, data: ProductTypes) => <PriceSale promo={data.price.salePercent} price={data.price.original} unit="VNĐ" />,
    },
    {
      title: t('system.status'),
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (_name: string, data: ProductTypes) => (
        <StatusLabel status={data.status} />
      ),
    },
    {
      title: t('system.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: {
        compare: (a: ProductTypes, b: ProductTypes) => {
          const aDate = new Date(a.createdAt);
          const bDate = new Date(b.createdAt);
          return Number(aDate) - Number(bDate);
        },
      },
      sortDirections: ['descend', 'ascend'],
      render: (_: string, data: ProductTypes) => (
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
        compare: (a: ProductTypes, b: ProductTypes) => {
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
  const onDelete = async (data: ProductTypes[], lang?: string) => {
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
          <Button type="primary" onClick={() => navigate(`${ROUTE_PATHS.PRODUCT_DETAIL}?locale=${defaultWebsiteLanguage}`)}>
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
            navigate(`${ROUTE_PATHS.PRODUCT_DETAIL}?id=${id}&locale=${locale}`);
          }}
          handleCreatePage={(id, _, locale) => {
            navigate(`${ROUTE_PATHS.PRODUCT_DETAIL}?id=${id}&locale=${locale}`);
          }}
          tableProps={{
            initShowColumns: ['id', 'name', 'colorSize', 'price'],
            columns,
            pageData: productData,
            currentPage,
            pageSize: currentView,
            handleSetCurrentPage,
            handleSetCurrentView,
            total: products?.meta.total || 1,
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

export default ProductManagement;
