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
import { deleteCouponService, getAllCouponService } from 'common/services/coupon';
import { CouponItemData } from 'common/services/coupon/types';
import { ROUTE_PATHS } from 'common/utils/constant';
import { formatDateTime, renderValue } from 'common/utils/functions';

export type CouponTypes = {
  id: number;
  code: string;
  startDate: string;
  endDate: string;
  discountValue: number;
  isActive: boolean;
  applyProducts: string[];
};

const converCoupons = (data: CouponItemData[]): CouponTypes[] => {
  if (!data.length) return [];
  return data.map((val) => ({
    id: val.id,
    code: val.code,
    startDate: val.startDate,
    endDate: val.endDate,
    discountValue: val.discountValue,
    isActive: val.isActive,
    applyProducts: val.applyProducts.map((item) => item.code)
  }));
};

const CouponManagement: React.FC = () => {
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

  const queryKey = ['getAllCoupon', keyword, currentPage, currentView];

  /* Queries */
  const { data: coupons, isLoading } = useQuery(
    queryKey,
    () => getAllCouponService({
      keyword, page: currentPage, limit: currentView
    }),
  );

  const { mutate: deleteMutate, isLoading: deleteLoading } = useMutation(
    ['deleteCoupon'],
    async (ids: number[]) => deleteCouponService({ ids }),
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
    if (coupons) {
      return converCoupons(coupons.data);
    }
    return [];
  }, [coupons]);

  /* Variables */
  const columns: ColumnsType<CouponTypes> = [
    {
      title: 'ID',
      key: 'id',
      width: 55,
      align: 'center',
      fixed: 'left',
      sorter: {
        compare: (a: CouponTypes, b: CouponTypes) => a.id - b.id,
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: CouponTypes) => (
        <Typography.Text>
          {data.id}
        </Typography.Text>
      ),
    },
    // --- Tiêu đề
    {
      title: t('coupon.code'),
      dataIndex: 'code',
      key: 'code',
      sorter: {
        compare: (
          a: CouponTypes,
          b: CouponTypes
        ) => a.code.localeCompare(b.code)
      },
      sortDirections: ['descend', 'ascend'],
      render: (_: string, data: CouponTypes) => (
        <Typography.Text
          onClick={() => navigate(`${ROUTE_PATHS.COUPON_DETAIL}?id=${data.id}&locale=${defaultWebsiteLanguage}`)}
          style={{ color: '#4a4a4a', cursor: 'pointer' }}
        >
          {data.code}
        </Typography.Text>
      ),
    },
    {
      title: t('coupon.discountValue'),
      dataIndex: 'discountValue',
      key: 'discountValue',
      render: (_: string, data: CouponTypes) => (
        <Typography.Text
          style={{ color: '#4a4a4a', cursor: 'pointer' }}
        >
          {renderValue(String(data.discountValue))}
        </Typography.Text>
      ),
    },
    {
      title: t('coupon.applyProducts'),
      dataIndex: 'applyProducts',
      key: 'applyProducts',
      render: (_: string, data: CouponTypes) => (
        <ul>
          {data.applyProducts.map((item) => (
            <li>
              <Typography.Text>
                <strong>{item}</strong>
              </Typography.Text>
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: t('coupon.startDate'),
      dataIndex: 'startDate',
      key: 'startDate',
      sorter: {
        compare: (a: CouponTypes, b: CouponTypes) => {
          const aDate = new Date(a.startDate);
          const bDate = new Date(b.startDate);
          return Number(aDate) - Number(bDate);
        },
      },
      sortDirections: ['descend', 'ascend'],
      render: (_: string, data: CouponTypes) => (
        <Typography.Text
          style={{ color: '#4a4a4a', cursor: 'pointer' }}
        >
          {formatDateTime(data.startDate)}
        </Typography.Text>
      ),
    },
    {
      title: t('coupon.endDate'),
      dataIndex: 'endDate',
      key: 'endDate',
      sorter: {
        compare: (a: CouponTypes, b: CouponTypes) => {
          const aDate = new Date(a.endDate);
          const bDate = new Date(b.endDate);
          return Number(aDate) - Number(bDate);
        },
      },
      sortDirections: ['descend', 'ascend'],
      render: (_: string, data: CouponTypes) => (
        <Typography.Text
          style={{ color: '#4a4a4a', cursor: 'pointer' }}
        >
          {formatDateTime(data.endDate)}
        </Typography.Text>
      ),
    },
    {
      title: t('system.status'),
      dataIndex: 'active',
      key: 'active',
      width: 160,
      render: (_name: string, data: CouponTypes) => (
        <Typography.Text>
          {data.isActive ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
        </Typography.Text>
      ),
    },
    {
      title: t('system.action'),
      key: 'action',
      width: 100,
      align: 'center',
      render: (_name: string, data: CouponTypes) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`${ROUTE_PATHS.COUPON_DETAIL}?id=${data.id}&locale=${defaultWebsiteLanguage}`)}
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
        title={t('sidebar.coupon')}
        rightHeader={(
          <Button type="primary" onClick={() => navigate(`${ROUTE_PATHS.COUPON_DETAIL}?locale=${defaultWebsiteLanguage}`)}>
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
            initShowColumns: ['id', 'code', 'discountValue', 'applyProducts', 'active', 'action'],
            columns,
            pageData: categoriesData,
            currentPage,
            pageSize: currentView,
            handleSetCurrentPage,
            handleSetCurrentView,
            total: coupons?.meta.total || 1,
            noDeleteLanguage: true,
            noBaseCol: true
          }}
          noCheckbox
        />
      </div>
    </>
  );
};

export default CouponManagement;
