import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAppSelector } from 'app/store';
import HeaderPage from 'common/components/HeaderPage';
import PageTable from 'common/components/PageTable';
import {
  FilterDataProps, FilterValueProps, mappingFilterFields,
  mappingFilterToQuery, mappingParamsFilter, mappingQueryParamsFilter
} from 'common/components/PageTable/filter';
import useNavigateParams from 'common/hooks/useNavigateParams';
import getAllBannersService, { deleteMultipleBannerByIdService } from 'common/services/banners';
import { BannerItemTypes, GetAllBannersTypes } from 'common/services/banners/types';
import { ROUTE_PATHS } from 'common/utils/constant';
import { formatDateTime } from 'common/utils/functions';

const convertBannerData = (data: GetAllBannersTypes[]) => {
  if (!data.length) return [];
  return data.map((val) => ({
    id: val.bannerData.id,
    updatedAt: val.bannerData.updatedAt,
    title: val.translations.vi ? val.translations.vi.name : val.translations.en.name,
    locale: Object.fromEntries(
      Object
        .entries(val.translations)
        .map(([k, o]) => [k, { ...o, id: val.bannerData.id, }])
    ),
  }));
};

const BannerManagement: React.FC<ActiveRoles> = ({
  roleCreate, roleView, roleDelete, roleUpdate
}) => {
  /* Hooks */
  const { t } = useTranslation();
  const navigate = useNavigate();
  const navigateParams = useNavigateParams();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  /* Selectors */
  const {
    defaultPageSize, defaultWebsiteLanguage,
    advancedFilter
  } = useAppSelector((state) => state.system);

  /* States */
  const [pageData, setPageData] = useState<BannerItemTypes[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentView, setCurrentView] = useState(defaultPageSize);
  const [keyword, setKeyword] = useState('');
  const [selectedFilterList, setSelectedFilterList] = useState<
    FilterValueProps[]>(mappingQueryParamsFilter(params));

  const returnParamsFilter = useMemo(
    () => mappingParamsFilter(selectedFilterList),
    [selectedFilterList]
  );

  /* Queries */
  const { isLoading } = useQuery(
    ['getAllBanner', keyword, currentPage, currentView, selectedFilterList],
    () => getAllBannersService({
      keyword, page: currentPage, limit: currentView, ...returnParamsFilter
    }),
    {
      onSuccess: (data) => {
        setPageData(convertBannerData(data.data));
      }
    }
  );

  /**
   * Column Generation
   */
  const columns: ColumnsType<BannerItemTypes> = [
    {
      title: 'ID',
      key: 'id',
      width: 55,
      align: 'center',
      fixed: 'left',
      sorter: {
        compare: (a: BannerItemTypes, b: BannerItemTypes) => a.id - b.id,
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: BannerItemTypes) => (
        <Typography.Text>
          {data.id}
        </Typography.Text>
      ),
    },
    // --- Tiêu đề
    {
      title: t('system.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: {
        compare: (a: BannerItemTypes, b: BannerItemTypes) => a.title.localeCompare(b.title),
      },
      sortDirections: ['descend', 'ascend'],
      render: (_: string, data: any) => (
        <Typography.Text
          style={{ color: '#4a4a4a', cursor: 'pointer' }}
          onClick={() => roleView && navigateParams(`${ROUTE_PATHS.BANNER_DETAIL}`, `id=${data.id}&locale=${defaultWebsiteLanguage}`)}
        >
          {data.title}
        </Typography.Text>
      ),
    },
    // --- Cập nhật
    {
      title: t('system.updatedAt'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: {
        compare: (a: BannerItemTypes, b: BannerItemTypes) => {
          const aDate = new Date(a.updatedAt);
          const bDate = new Date(b.updatedAt);
          return Number(aDate) - Number(bDate);
        },
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: BannerItemTypes) => (
        <Typography.Text>
          {formatDateTime(data.updatedAt)}
        </Typography.Text>
      ),
    },
  ];

  const filterFields: FilterDataProps[] = useMemo(
    () => mappingFilterFields('banner', advancedFilter),
    [advancedFilter]
  );

  /* Functions */
  const onDelete = async (data: BannerItemTypes[]) => {
    setLoading(true);
    const ids = data.map((val) => val.id);
    try {
      await deleteMultipleBannerByIdService({ ids });
      message.success(t('message.deleteSuccess'));
      queryClient.invalidateQueries(['getAllBanner']);
    } catch (error) {
      message.error(t('message.deleteError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSetCurrentPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleSetCurrentView = (view: number) => {
    setCurrentView(view);
  };

  const handleFilter = (data: FilterValueProps) => {
    const typeFilter = String(data.filter).split('.')[1];
    if ((typeFilter === 'isNull' || typeFilter === 'isNotNull') && selectedFilterList.find((item) => item.key === data.key)) {
      return;
    }
    const counter = selectedFilterList.filter(
      (item) => item.field === data.field && item.filter === data.filter
    ).length;
    setSelectedFilterList([...selectedFilterList, { ...data, index: counter }]);
  };

  const handleDeleteFilter = (key: string, index?: number) => {
    const tempList = selectedFilterList.slice();
    setSelectedFilterList(tempList.filter((item) => !(item.key === key && item.index === index)));
  };

  useEffect(() => {
    setSearchParams(mappingFilterToQuery(selectedFilterList));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilterList]);

  /* Render */
  return (
    <>
      <HeaderPage
        fixed
        title={t('sidebar.banner')}
        rightHeader={(
          <Button
            type="primary"
            disabled={!roleCreate}
            onClick={() => navigate(`${ROUTE_PATHS.BANNER_DETAIL}?locale=${defaultWebsiteLanguage}`)}
          >
            <PlusOutlined />
            {t('system.create')}
          </Button>
        )}
      />
      <div className="t-mainlayout_wrapper">
        <PageTable
          handleDelete={onDelete}
          isLoading={loading || isLoading}
          handleEditPage={(id, _, language) => navigateParams(`${ROUTE_PATHS.BANNER_DETAIL}`, `id=${id}&locale=${language}`)}
          handleCreatePage={(id, _, language) => navigateParams(`${ROUTE_PATHS.BANNER_DETAIL}`, `id=${id}&locale=${language}`)}
          handleSearch={setKeyword}
          roles={{ roleCreate, roleDelete, roleUpdate }}
          tableProps={{
            initShowColumns: ['id', 'name'],
            columns,
            pageData,
            currentPage,
            pageSize: currentView,
            handleSetCurrentPage,
            handleSetCurrentView,
            total: pageData.length,
            noDeleteLanguage: true,
            filterFields,
          }}
          filtersDataTable={{
            handleFilter,
            selectedFilterList,
            handleDeleteFilter,
          }}
        />
      </div>
    </>
  );
};

export default BannerManagement;
