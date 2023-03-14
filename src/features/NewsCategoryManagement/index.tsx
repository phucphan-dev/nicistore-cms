import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAppSelector } from 'app/store';
import HeaderPage from 'common/components/HeaderPage';
import PageTable from 'common/components/PageTable';
import {
  FilterDataProps, FilterValueProps, mappingFilterFields,
  mappingFilterToQuery, mappingParamsFilter, mappingQueryParamsFilter
} from 'common/components/PageTable/filter';
import StatusLabel from 'common/components/StatusLabel';
import {
  getAllNewsCategoryService, deleteNewsCategoryService,
  deleteNewsCategoryTranslationService, changeStatusNewsCategoryManyIdService
} from 'common/services/news';
import { ROUTE_PATHS } from 'common/utils/constant';
import { formatDateTime } from 'common/utils/functions';
import roles, { getPermission } from 'configs/roles';

export type NewsCategoryDataTypes = {
  id: number;
  name: string;
  parentCategory: string;
  visibleInfomation?: number;
  state?: string;
  status: number;
  updatedAt: string;
  locale: {
    [lang: string]: {
      id: number;
      name: string;
      slug: string;
    }
  };
};

const NewsCategoryManagement: React.FC<ActiveRoles> = ({
  roleView, roleCreate, roleDelete, roleUpdate
}) => {
  /* Hooks */
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  /* Selectors */
  const {
    defaultPageSize,
    defaultWebsiteLanguage, advancedFilter
  } = useAppSelector((state) => state.system);
  const rolesUser = useAppSelector((state) => state.auth.roles);

  /* States */
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
  const { isLoading, data: newsCategoryData } = useQuery(
    ['getAllNewsCategoryService', keyword, currentPage, currentView, selectedFilterList],
    () => getAllNewsCategoryService({
      keyword, page: currentPage, limit: currentView, ...returnParamsFilter
    }),
  );

  const { mutate: deleteNewsCateMutate, isLoading: deleteNewsCateLoading } = useMutation(
    ['news-category-delete'],
    async (ids: number[]) => deleteNewsCategoryService({ ids }),
    {
      onSuccess: () => {
        message.success(t('message.deleteSuccess'));
        queryClient.invalidateQueries(['getAllNewsCategoryService']);
      },
      onError: () => {
        message.error(t('message.deleteError'));
      }
    }
  );

  const {
    mutate: deleteNewsCateTranslationMutate,
    isLoading: deleteNewsCateTranslationLoading
  } = useMutation(
    ['news-category-translation-delete'],
    async (ids: number[]) => deleteNewsCategoryTranslationService({ ids }),
    {
      onSuccess: () => {
        message.success(t('message.deleteSuccess'));
        queryClient.invalidateQueries(['getAllNewsCategoryService']);
      },
      onError: () => {
        message.error(t('message.deleteError'));
      }

    }
  );

  const { mutate: changeStatusMutate, isLoading: changeStatusLoading } = useMutation(
    ['changeStatusManyId'],
    async (data:
      {
        ids: number[],
        status: number
      }) => changeStatusNewsCategoryManyIdService(data.ids, data.status),
    {
      onSuccess: () => {
        message.success(t('message.updateStatusSuccess'));
        queryClient.invalidateQueries(['getAllNewsCategoryService', keyword, currentPage, currentView, selectedFilterList]);
      },
      onError: () => {
        message.error(t('message.updateStatusError'));
      }
    }
  );

  /* Variables */
  const columns: ColumnsType<NewsCategoryDataTypes> = [
    {
      title: 'ID',
      key: 'id',
      width: 55,
      align: 'center',
      fixed: 'left',
      sorter: {
        compare: (a: NewsCategoryDataTypes, b: NewsCategoryDataTypes) => a.id - b.id,
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: NewsCategoryDataTypes) => (
        <Typography.Text>
          {data.id}
        </Typography.Text>
      ),
    },
    // --- Tên
    {
      title: t('system.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: {
        compare: (
          a: NewsCategoryDataTypes,
          b: NewsCategoryDataTypes
        ) => a.name.localeCompare(b.name)
      },
      sortDirections: ['descend', 'ascend'],
      render: (_: string, data: NewsCategoryDataTypes) => (
        <Typography.Text
          style={{ color: '#4a4a4a', cursor: 'pointer' }}
          onClick={() => roleView && navigate(`${ROUTE_PATHS.NEWS_CATEGORY_DETAIL}?id=${data.id}&locale=${defaultWebsiteLanguage}`)}
        >
          {data.name}
        </Typography.Text>
      ),
    },
    // --- Phân loại cha
    // {
    //   title: 'Phân loại cha',
    //   dataIndex: 'parentCategory',
    //   key: 'parentCategory',
    //   render: (_: string, data: any) => (
    //     <Typography.Text
    //       style={{ color: '#4a4a4a', cursor: 'pointer' }}
    //     >
    //       {data.parentCategory}
    //     </Typography.Text>
    //   ),
    // },
    // // --- Thông tin hiển thị
    // {
    //   title: 'Thông tin hiển thị',
    //   dataIndex: 'visibleInfomation',
    //   key: 'visibleInfomation',
    //   sorter: {
    //     compare: (
    //       a: NewsCategoryDataTypes,
    //       b: NewsCategoryDataTypes
    //     ) => a.visibleInfomation - b.visibleInfomation
    //   },
    //   sortDirections: ['descend', 'ascend'],
    //   render: (_: string, data: any) => (
    //     <Typography.Text
    //       style={{ color: '#4a4a4a', cursor: 'pointer' }}
    //     >
    //       {data.visibleInfomation}
    //     </Typography.Text>
    //   ),
    // },
    // --- Trạng thái
    {
      title: t('system.status'),
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (_: string, data: NewsCategoryDataTypes) => (
        <StatusLabel status={data.status} />
      ),
    },
    // --- Cập nhật lúc
    {
      title: t('system.publishedAt'),
      dataIndex: 'publishedAt',
      key: 'createdAt',
      sorter: {
        compare: (a: NewsCategoryDataTypes, b: NewsCategoryDataTypes) => {
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

  const filterFields: FilterDataProps[] = useMemo(
    () => mappingFilterFields('newsCategory', advancedFilter),
    [advancedFilter]
  );

  const newsData: NewsCategoryDataTypes[] = useMemo(() => (newsCategoryData?.data?.map((val) => ({
    id: val.newsCategoryData.id,
    name: val.translations.vi?.name || val.translations.en?.name || '',
    parentCategory: val.parentCategory ? val.parentCategory : '-',
    // visibleInfomation: 2,
    // state: 'poppular',
    status: val.newsCategoryData.status,
    updatedAt: val.newsCategoryData.updatedAt,
    locale: Object.fromEntries(
      Object
        .entries(val.translations)
        .map(([k, o]) => [k, { ...o, id: val.translations[k].id, }])
    )
  })) || []), [newsCategoryData]);

  /* Functions */
  const onDelete = async (data: NewsCategoryDataTypes[], code?: string) => {
    switch (code) {
      case 'allRow':
      case 'all': {
        deleteNewsCateMutate(data.map((item) => item.id));
        break;
      }
      default: {
        if (code) {
          const localeId = data?.[0].locale[code]?.id;
          if (localeId) {
            deleteNewsCateTranslationMutate([localeId]);
          }
        }
        break;
      }
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
        title={t('sidebar.newsCategory')}
        rightHeader={(
          <Button
            type="primary"
            disabled={!roleCreate}
            onClick={() => navigate(`${ROUTE_PATHS.NEWS_CATEGORY_DETAIL}?locale=${defaultWebsiteLanguage}`)}
          >
            <PlusOutlined />
            {t('system.create')}
          </Button>
        )}
      />
      <div className="t-mainlayout_wrapper">
        <PageTable
          isLoading={isLoading || deleteNewsCateLoading || deleteNewsCateTranslationLoading}
          handleSearch={setKeyword}
          handleDelete={onDelete}
          handleEditPage={(id, _, locale) => {
            navigate(`${ROUTE_PATHS.NEWS_CATEGORY_DETAIL}?id=${id}&locale=${locale}`);
          }}
          handleCreatePage={(id, _, locale) => {
            navigate(`${ROUTE_PATHS.NEWS_CATEGORY_DETAIL}?id=${id}&locale=${locale}`);
          }}
          roles={{ roleCreate, roleDelete, roleUpdate }}
          tableProps={{
            initShowColumns: ['id', 'name', 'status'],
            columns,
            pageData: newsData,
            currentPage,
            pageSize: currentView,
            handleSetCurrentPage,
            handleSetCurrentView,
            total: newsData.length,
            filterFields,
          }}
          filtersDataTable={{
            handleFilter,
            selectedFilterList,
            handleDeleteFilter,
          }}
          statusDataTable={{
            handleChangeStatus:
              (data, status) => changeStatusMutate({ ids: data.map((item) => item.id), status }),
            changeStatusLoading,
            canChangeStatusApprove: getPermission(rolesUser, roles.NEWS_CATE_APPROVED),
          }}
        />
      </div>
    </>
  );
};

export default NewsCategoryManagement;
